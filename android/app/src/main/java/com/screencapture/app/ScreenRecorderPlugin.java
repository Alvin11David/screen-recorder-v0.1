package com.screencapture.app;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Build;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.concurrent.CompletableFuture;

@CapacitorPlugin(
    name = "ScreenRecorder",
    permissions = {
        @Permission(alias = "recordingAudio", strings = { Manifest.permission.RECORD_AUDIO })
    }
)
public class ScreenRecorderPlugin extends Plugin {

    private boolean pendingRecordAudio = true;
    private String pendingFormat = "mp4";

    @PluginMethod
    public void start(PluginCall call) {
        boolean recordAudio = call.getBoolean("recordAudio", true);
        String format = call.getString("format", "mp4");
        if (!"webm".equals(format) && !"mpegts".equals(format)) {
            format = "mp4";
        }
        pendingRecordAudio = recordAudio;
        pendingFormat = format;

        if (ScreenRecordingService.isRecording()) {
            JSObject ret = new JSObject();
            ret.put("alreadyRecording", true);
            call.resolve(ret);
            return;
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.reject("Screen recording requires Android 8.0+");
            return;
        }

        if (recordAudio && getPermissionState("recordingAudio") != PermissionState.GRANTED) {
            requestPermissionForAlias("recordingAudio", call, "permissionCallback");
            return;
        }

        beginMediaProjection(call);
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        if (getPermissionState("recordingAudio") == PermissionState.GRANTED) {
            beginMediaProjection(call);
        } else {
            call.reject("Microphone permission was denied");
        }
    }

    private void beginMediaProjection(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is not available");
            return;
        }
        MediaProjectionManager mpm =
            (MediaProjectionManager) activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        Intent intent = mpm.createScreenCaptureIntent();
        startActivityForResult(call, intent, "mediaProjectionCallback");
    }

    @ActivityCallback
    private void mediaProjectionCallback(PluginCall call, ActivityResult result) {
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("Screen capture permission was denied");
            return;
        }
        Intent serviceIntent = new Intent(getContext(), ScreenRecordingService.class);
        serviceIntent.setAction(ScreenRecordingService.ACTION_START);
        serviceIntent.putExtra(ScreenRecordingService.EXTRA_RESULT_CODE, result.getResultCode());
        serviceIntent.putExtra(ScreenRecordingService.EXTRA_RESULT_DATA, result.getData());
        serviceIntent.putExtra(ScreenRecordingService.EXTRA_RECORD_AUDIO, pendingRecordAudio);
        serviceIntent.putExtra(ScreenRecordingService.EXTRA_RECORD_FORMAT, pendingFormat);
        getContext().startForegroundService(serviceIntent);
        JSObject ret = new JSObject();
        ret.put("started", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (!ScreenRecordingService.isRecording()) {
            call.reject("No active screen recording");
            return;
        }
        CompletableFuture<ScreenRecordingService.RecordingResult> future = new CompletableFuture<>();
        ScreenRecordingService.setPendingResult(future);
        getContext().startService(
            new Intent(getContext(), ScreenRecordingService.class)
                .setAction(ScreenRecordingService.ACTION_STOP));
        future.whenComplete((result, err) -> {
            if (err != null) {
                getBridge().executeOnMainThread(() -> call.reject(err.getMessage()));
            } else {
                JSObject ret = new JSObject();
                ret.put("path", result.fileName);
                ret.put("mimeType", result.mimeType);
                ret.put("width", result.width);
                ret.put("height", result.height);
                ret.put("durationMs", result.durationMs);
                ret.put("cancelled", result.cancelled);
                getBridge().executeOnMainThread(() -> call.resolve(ret));
            }
        });
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        if (!ScreenRecordingService.isRecording()) {
            call.reject("No active screen recording");
            return;
        }
        CompletableFuture<ScreenRecordingService.RecordingResult> future = new CompletableFuture<>();
        ScreenRecordingService.setPendingResult(future);
        getContext().startService(
            new Intent(getContext(), ScreenRecordingService.class)
                .setAction(ScreenRecordingService.ACTION_CANCEL));
        future.whenComplete((result, err) -> {
            if (err != null) {
                getBridge().executeOnMainThread(() -> call.reject(err.getMessage()));
            } else {
                JSObject ret = new JSObject();
                ret.put("cancelled", true);
                getBridge().executeOnMainThread(() -> call.resolve(ret));
            }
        });
    }

    @PluginMethod
    public void isRecording(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("recording", ScreenRecordingService.isRecording());
        call.resolve(ret);
    }
}
