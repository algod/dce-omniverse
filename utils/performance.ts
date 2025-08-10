// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
  apiCallCount: number;
  cacheHitRate: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    timeToInteractive: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    apiCallCount: 0,
    cacheHitRate: 0
  };

  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private apiCalls = 0;
  private cacheHits = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMetrics();
    }
  }

  private initializeMetrics() {
    // Use Performance Observer API
    if ('PerformanceObserver' in window) {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      
      try {
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint observer not supported');
      }

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observe layout shift
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        this.metrics.cumulativeLayoutShift = cls;
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
      }
    });

    // Memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
      }, 10000);
    }
  }

  // Track API calls
  trackApiCall(url: string, fromCache: boolean = false) {
    this.apiCalls++;
    if (fromCache) {
      this.cacheHits++;
    }
    this.metrics.apiCallCount = this.apiCalls;
    this.metrics.cacheHitRate = this.apiCalls > 0 ? (this.cacheHits / this.apiCalls) * 100 : 0;
  }

  // Cache management
  getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      this.trackApiCall(key, true);
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Clean old cache entries
    if (this.cache.size > 100) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 20 entries
      for (let i = 0; i < 20; i++) {
        this.cache.delete(sortedEntries[i][0]);
      }
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Performance score (0-100)
  getPerformanceScore(): number {
    const weights = {
      pageLoadTime: 0.2,
      timeToInteractive: 0.2,
      firstContentfulPaint: 0.15,
      largestContentfulPaint: 0.25,
      cumulativeLayoutShift: 0.1,
      cacheHitRate: 0.1
    };

    let score = 100;

    // Deduct points based on metrics
    if (this.metrics.pageLoadTime > 3000) score -= (this.metrics.pageLoadTime - 3000) / 100 * weights.pageLoadTime;
    if (this.metrics.timeToInteractive > 2000) score -= (this.metrics.timeToInteractive - 2000) / 100 * weights.timeToInteractive;
    if (this.metrics.firstContentfulPaint > 1000) score -= (this.metrics.firstContentfulPaint - 1000) / 50 * weights.firstContentfulPaint;
    if (this.metrics.largestContentfulPaint > 2500) score -= (this.metrics.largestContentfulPaint - 2500) / 100 * weights.largestContentfulPaint;
    if (this.metrics.cumulativeLayoutShift > 0.1) score -= this.metrics.cumulativeLayoutShift * 100 * weights.cumulativeLayoutShift;
    
    // Add points for good cache hit rate
    score += (this.metrics.cacheHitRate / 100) * 10 * weights.cacheHitRate;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Get recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.pageLoadTime > 3000) {
      recommendations.push('Page load time is high. Consider code splitting and lazy loading.');
    }

    if (this.metrics.largestContentfulPaint > 2500) {
      recommendations.push('LCP is slow. Optimize images and server response times.');
    }

    if (this.metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('High layout shift detected. Reserve space for dynamic content.');
    }

    if (this.metrics.cacheHitRate < 50) {
      recommendations.push('Low cache hit rate. Implement better caching strategies.');
    }

    if (this.metrics.memoryUsage && this.metrics.memoryUsage > 100) {
      recommendations.push('High memory usage. Check for memory leaks and optimize data structures.');
    }

    return recommendations;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy load images
export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Preload critical resources
export function preloadResources(urls: string[]) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Request idle callback wrapper
export function whenIdle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

// Memoization for expensive computations
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  }) as T;
}

// Virtual scrolling helper
export function calculateVisibleItems<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  buffer: number = 5
): { visibleItems: T[]; startIndex: number; endIndex: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );
  
  return {
    visibleItems: items.slice(startIndex, endIndex + 1),
    startIndex,
    endIndex
  };
}

// Batch updates for better performance
export class BatchProcessor<T> {
  private queue: T[] = [];
  private processing = false;
  private batchSize: number;
  private processDelay: number;
  private processor: (batch: T[]) => void;

  constructor(
    processor: (batch: T[]) => void,
    batchSize: number = 10,
    processDelay: number = 100
  ) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.processDelay = processDelay;
  }

  add(item: T) {
    this.queue.push(item);
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    await new Promise(resolve => setTimeout(resolve, this.processDelay));
    
    const batch = this.queue.splice(0, this.batchSize);
    this.processor(batch);
    
    this.processing = false;
    
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }
}