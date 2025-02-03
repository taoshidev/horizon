import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://596e65e5fabb40e628c57c1c4693ec3e@o4507335063568384.ingest.us.sentry.io/4508485460099072",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan({ name: "My First Transaction" }, () => {});

Sentry.profiler.stopProfiler();
