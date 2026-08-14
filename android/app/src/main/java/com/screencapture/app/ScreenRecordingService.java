package com.screencapture.app;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.MediaRecorder;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.SystemClock;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Surface;
import android.view.WindowManager;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.ByteBuffer;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

public class ScreenRecordingService extends Service {

    private static final String TAG = "ScreenFlowRecorder";
    private static final String CHANNEL_ID = "screenflow_screen_recording";
    private static final int NOTIFICATION_ID = 1101;

    public static final String ACTION_START = "com.screencapture.app.action.START_RECORDING";
    public static final String ACTION_STOP = "com.screencapture.app.action.STOP_RECORDING";
    public static final String ACTION_CANCEL = "com.screencapture.app.action.CANCEL_RECORDING";
    public static final String EXTRA_RESULT_CODE = "resultCode";
    public static final String EXTRA_RESULT_DATA = "resultData";
    public static final String EXTRA_RECORD_AUDIO = "recordAudio";
    public static final String EXTRA_RECORD_FORMAT = "recordFormat";

    private static final String TAG = "ScreenFlowRecorder";
    private static final int PREVIEW_MAX_DIMENSION = 640;
    private static final int PREVIEW_JPEG_QUALITY = 55;

    private static volatile boolean recording = false;
    private static volatile CompletableFuture<RecordingResult> pendingResult;

    private MediaProjection mediaProjection;
    private MediaRecorder mediaRecorder;
    private String fileName;
    private int width;
    private int height;
    private long startTimeMs;
    private FormatSpec formatSpec;

    private ImageReader previewReader;
    private VirtualDisplay previewDisplay;
    private HandlerThread previewThread;
    private Handler previewHandler;
    private volatile boolean previewActive;

    public static class RecordingResult {
        public final String fileName;
        public final String mimeType;
        public final int width;
        public final int height;
        public final long durationMs;
        public final boolean cancelled;

        public RecordingResult(String fileName, String mimeType, int width, int height, long durationMs, boolean cancelled) {
            this.fileName = fileName;
            this.mimeType = mimeType;
            this.width = width;
            this.height = height;
            this.durationMs = durationMs;
            this.cancelled = cancelled;
        }
    }

    /** Describes a supported recording output container and its codecs. */
    private static class FormatSpec {
        final int outputFormat;
        final int videoEncoder;
        final int audioEncoder;
        final String extension;
        final String mimeType;

        FormatSpec(int outputFormat, int videoEncoder, int audioEncoder, String extension, String mimeType) {
            this.outputFormat = outputFormat;
            this.videoEncoder = videoEncoder;
            this.audioEncoder = audioEncoder;
            this.extension = extension;
            this.mimeType = mimeType;
        }

        static FormatSpec forName(String name) {
            if ("webm".equals(name)) {
                return new FormatSpec(
                        MediaRecorder.OutputFormat.WEBM,
                        MediaRecorder.VideoEncoder.VP9,
                        MediaRecorder.AudioEncoder.VORBIS,
                        ".webm", "video/webm");
            }
            if ("mpegts".equals(name) && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                return new FormatSpec(
                        MediaRecorder.OutputFormat.MPEG_2_TS,
                        MediaRecorder.VideoEncoder.H264,
                        MediaRecorder.AudioEncoder.AAC,
                        ".ts", "video/mp2t");
            }
            return new FormatSpec(
                    MediaRecorder.OutputFormat.MPEG_4,
                    MediaRecorder.VideoEncoder.H264,
                    MediaRecorder.AudioEncoder.AAC,
                    ".mp4", "video/mp4");
        }
    }

    public static boolean isRecording() {
        return recording;
    }

    public static void setPendingResult(CompletableFuture<RecordingResult> future) {
        pendingResult = future;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        String action = intent.getAction();
        if (ACTION_START.equals(action)) {
            startRecording(intent);
        } else if (ACTION_STOP.equals(action)) {
            finishRecording(false);
        } else if (ACTION_CANCEL.equals(action)) {
            finishRecording(true);
        } else {
            stopSelf();
        }
        return START_NOT_STICKY;
    }

    private void startRecording(Intent intent) {
        if (recording) {
            return;
        }
        int resultCode = intent.getIntExtra(EXTRA_RESULT_CODE, Activity.RESULT_CANCELED);
        Intent data = intent.getParcelableExtra(EXTRA_RESULT_DATA);
        boolean recordAudio = intent.getBooleanExtra(EXTRA_RECORD_AUDIO, true);
        String formatName = intent.getStringExtra(EXTRA_RECORD_FORMAT);
        formatSpec = FormatSpec.forName(formatName);

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            Log.e(TAG, "Surface recording requires Android 8.0+");
            completeWithError("Screen recording requires Android 8.0+");
            return;
        }

        // Android 14+ requires the mediaProjection foreground service to be
        // running before MediaProjection can be obtained.
        startAsForeground();

        MediaProjectionManager mpm = (MediaProjectionManager) getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        mediaProjection = mpm.getMediaProjection(resultCode, data);
        if (mediaProjection == null) {
            Log.e(TAG, "Failed to obtain MediaProjection");
            completeWithError("Failed to obtain MediaProjection");
            return;
        }

        mediaProjection.registerCallback(new MediaProjection.Callback() {
            @Override
            public void onStop() {
                Log.i(TAG, "MediaProjection stopped by system");
                finishRecording(false);
            }
        }, new Handler(Looper.getMainLooper()));

        DisplayMetrics metrics = new DisplayMetrics();
        WindowManager wm = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        wm.getDefaultDisplay().getRealMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        int densityDpi = metrics.densityDpi;

        fileName = String.format(Locale.US, "screenflow_%d%s", System.currentTimeMillis(), formatSpec.extension);
        File out = new File(getCacheDir(), fileName);

        try {
            mediaRecorder = new MediaRecorder();
            mediaRecorder.setVideoSource(MediaRecorder.VideoSource.SURFACE);
            if (recordAudio) {
                mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            }
            mediaRecorder.setOutputFormat(formatSpec.outputFormat);
            if (recordAudio) {
                mediaRecorder.setAudioEncoder(formatSpec.audioEncoder);
                mediaRecorder.setAudioEncodingBitRate(128000);
                mediaRecorder.setAudioSamplingRate(44100);
            }
            mediaRecorder.setVideoEncoder(formatSpec.videoEncoder);
            mediaRecorder.setVideoSize(width, height);
            mediaRecorder.setVideoFrameRate(30);
            mediaRecorder.setVideoEncodingBitRate(Math.max(6000000, width * height * 4));
            mediaRecorder.setOutputFile(out.getAbsolutePath());
            mediaRecorder.prepare();

            Surface surface = mediaRecorder.getSurface();
            mediaRecorder.start();

            mediaProjection.createVirtualDisplay(
                    "ScreenFlowRecording",
                    width, height, densityDpi,
                    DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                    surface, null, null);

            recording = true;
            startTimeMs = SystemClock.elapsedRealtime();
            startPreview();
            Log.i(TAG, "Recording started: " + fileName + " " + width + "x" + height);
        } catch (Exception ex) {
            Log.e(TAG, "Failed to start recording", ex);
            releaseRecorder();
            if (mediaProjection != null) {
                mediaProjection.stop();
                mediaProjection = null;
            }
            completeWithError("Failed to start recording: " + ex.getMessage());
        }
    }

    private void finishRecording(boolean cancel) {
        if (!recording) {
            return;
        }
        long durationMs = SystemClock.elapsedRealtime() - startTimeMs;
        recording = false;

        releaseRecorder();
        if (mediaProjection != null) {
            mediaProjection.stop();
            mediaProjection = null;
        }

        File out = new File(getCacheDir(), fileName);
        String mimeType = formatSpec != null ? formatSpec.mimeType : "video/mp4";
        if (cancel || !out.exists() || out.length() == 0) {
            if (out.exists()) {
                out.delete();
            }
            completeResult(new RecordingResult(null, mimeType, width, height, durationMs, true));
        } else {
            completeResult(new RecordingResult(fileName, mimeType, width, height, durationMs, false));
        }

        stopForeground(true);
        stopSelf();
    }

    private void releaseRecorder() {
        if (mediaRecorder != null) {
            try {
                mediaRecorder.stop();
            } catch (RuntimeException ex) {
                Log.w(TAG, "MediaRecorder stop failed", ex);
            }
            mediaRecorder.release();
            mediaRecorder = null;
        }
    }

    private void completeWithError(String message) {
        recording = false;
        CompletableFuture<RecordingResult> future = pendingResult;
        pendingResult = null;
        if (future != null) {
            future.completeExceptionally(new RuntimeException(message));
        }
        stopForeground(true);
        stopSelf();
    }

    private void completeResult(RecordingResult result) {
        CompletableFuture<RecordingResult> future = pendingResult;
        pendingResult = null;
        if (future != null) {
            future.complete(result);
        }
    }

    private void startAsForeground() {
        Notification notification = buildNotification();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    private Notification buildNotification() {
        Notification.Builder builder = new Notification.Builder(this, CHANNEL_ID);
        builder.setContentTitle("Screen recording in progress")
                .setContentText("ScreenFlow is recording your screen")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setOngoing(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            builder.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
        }
        return builder.build();
    }

    private void createNotificationChannel() {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, "Screen recording", NotificationManager.IMPORTANCE_LOW);
        channel.setDescription("Ongoing notification while recording the screen");
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        nm.createNotificationChannel(channel);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (recording) {
            finishRecording(true);
        }
        if (mediaProjection != null) {
            mediaProjection.stop();
            mediaProjection = null;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
