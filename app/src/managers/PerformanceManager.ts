/**
 * PerformanceManager - Handles performance monitoring and optimization
 * Fixed TypeScript issues with proper type assertions
 */

// Extended performance interfaces for better type safety
interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
    cancelable?: boolean;
}

interface PerformanceLayoutShiftEntry extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
    lastInputTime: number;
    sources: any[];
}

interface PerformanceLargestContentfulPaintEntry extends PerformanceEntry {
    renderTime: number;
    loadTime: number;
    size: number;
    id: string;
    url: string;
    element: Element | null;
}

interface PerformanceMetrics {
    fcp: number | null; // First Contentful Paint
    lcp: number | null; // Largest Contentful Paint
    fid: number | null; // First Input Delay
    cls: number | null; // Cumulative Layout Shift
    ttfb: number | null; // Time to First Byte
}

class PerformanceManager {
    private static instance: PerformanceManager;
    private metrics: PerformanceMetrics = {
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null
    };
    private observers: Map<string, PerformanceObserver> = new Map();

    private constructor() {
        this.init();
    }

    static getInstance(): PerformanceManager {
        if (!PerformanceManager.instance) {
            PerformanceManager.instance = new PerformanceManager();
        }
        return PerformanceManager.instance;
    }

    private init(): void {
        if (typeof window === 'undefined') return;

        this.observeWebVitals();
        this.observeResourceTiming();
        this.setupErrorTracking();
    }

    private observeWebVitals(): void {
        // Observe paint metrics (FCP)
        if ('PerformanceObserver' in window) {
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                        this.reportMetric('fcp', entry.startTime);
                    }
                }
            });
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.set('paint', paintObserver);

            // Observe LCP with proper typing
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as PerformanceLargestContentfulPaintEntry;
                this.metrics.lcp = lastEntry.startTime;
                this.reportMetric('lcp', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('lcp', lcpObserver);

            // Observe FID with proper type assertion
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Type assertion for PerformanceEventTiming
                    const eventEntry = entry as PerformanceEventTiming;
                    if (eventEntry.processingStart !== undefined) {
                        this.metrics.fid = eventEntry.processingStart - eventEntry.startTime;
                        this.reportMetric('fid', this.metrics.fid);
                    }
                }
            });

            // Use try-catch for better error handling
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.set('fid', fidObserver);
            } catch (error) {
                console.warn('First Input Delay observation not supported:', error);
            }

            // Observe CLS with proper typing
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const layoutShiftEntry = entry as PerformanceLayoutShiftEntry;
                    if (!layoutShiftEntry.hadRecentInput) {
                        clsValue += layoutShiftEntry.value;
                    }
                }
                this.metrics.cls = clsValue;
                this.reportMetric('cls', clsValue);
            });

            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('cls', clsObserver);
            } catch (error) {
                console.warn('Cumulative Layout Shift observation not supported:', error);
            }
        }
    }

    private observeResourceTiming(): void {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.analyzeResourceTiming(entry as PerformanceResourceTiming);
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.set('resource', resourceObserver);
        }
    }

    private analyzeResourceTiming(entry: PerformanceResourceTiming): void {
        const duration = entry.responseEnd - entry.startTime;

        // Log slow resources (>1s)
        if (duration > 1000) {
            console.warn(`Slow resource detected: ${entry.name} took ${duration}ms`);
        }

        // Track TTFB for main document
        if (entry.initiatorType === 'navigation') {
            this.metrics.ttfb = entry.responseStart - entry.startTime;
            this.reportMetric('ttfb', this.metrics.ttfb);
        }
    }

    private setupErrorTracking(): void {
        window.addEventListener('error', (event) => {
            this.reportError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack
            });
        });
    }

    private reportMetric(name: string, value: number): void {
        // In development, log to console
        if (import.meta.env.MODE === 'development') {
            console.log(`Performance Metric - ${name.toUpperCase()}: ${value}ms`);
        }

        // Report to analytics service
        this.sendToAnalytics('performance_metric', {
            metric_name: name,
            metric_value: value,
            url: window.location.href,
            timestamp: Date.now()
        });
    }

    private reportError(error: any): void {
        console.error('Application Error:', error);

        this.sendToAnalytics('error', {
            ...error,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });
    }

    private sendToAnalytics(eventName: string, data: any): void {
        // Placeholder for analytics integration
        // This will be implemented when AnalyticsManager is created
        if (import.meta.env.MODE === 'development') {
            console.log(`Analytics Event: ${eventName}`, data);
        }
    }

    public getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    public startMark(name: string): void {
        if ('performance' in window && performance.mark) {
            performance.mark(`${name}-start`);
        }
    }

    public endMark(name: string): number | null {
        if ('performance' in window && performance.mark && performance.measure) {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);

            const entries = performance.getEntriesByName(name, 'measure');
            return entries.length > 0 ? entries[0].duration : null;
        }
        return null;
    }

    public destroy(): void {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

export default PerformanceManager;