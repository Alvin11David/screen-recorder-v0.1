import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface Props {
  onSuccess?: () => void;
}

const PROVIDERS = [
  {
    id: "google" as const,
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    id: "github" as const,
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "microsoft" as const,
    label: "Microsoft",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect x="2" y="2" width="9" height="9" rx="1" fill="#F25022" />
        <rect x="13" y="2" width="9" height="9" rx="1" fill="#7FBA00" />
        <rect x="2" y="13" width="9" height="9" rx="1" fill="#00A4EF" />
        <rect x="13" y="13" width="9" height="9" rx="1" fill="#FFB900" />
      </svg>
    ),
  },
];

export function SocialLoginButtons({ onSuccess }: Props) {
  const { loginWithOAuth, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (provider: (typeof PROVIDERS)[number]) => {
    setError(null);
    const err = await loginWithOAuth(provider.id);
    if (err) setError(err);
    else onSuccess?.();
  };

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleClick(provider)}
            className={cn(
              "flex items-center justify-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              "bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12]",
              "border border-border/50 hover:border-border/80",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {provider.icon}
            <span className="text-foreground">{provider.label}</span>
          </button>
        ))}
      </div>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground/60">or continue with</span>
        </div>
      </div>
    </div>
  );
}
