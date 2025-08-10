// Statistical Analysis Utilities for Data Processing

export class StatisticsUtils {
  // Calculate mean of an array
  static mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Calculate median of an array
  static median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 
      ? sorted[mid] 
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Calculate standard deviation
  static standardDeviation(values: number[]): number {
    const avg = this.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }

  // Calculate percentile
  static percentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  // Calculate correlation coefficient
  static correlation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const xMean = this.mean(x);
    const yMean = this.mean(y);
    
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < x.length; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(xDenominator * yDenominator);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Linear regression
  static linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
    if (x.length !== y.length || x.length < 2) {
      return { slope: 0, intercept: 0, r2: 0 };
    }

    const n = x.length;
    const xMean = this.mean(x);
    const yMean = this.mean(y);

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (x[i] - xMean) * (y[i] - yMean);
      denominator += Math.pow(x[i] - xMean, 2);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Calculate R-squared
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
      const predicted = slope * x[i] + intercept;
      ssRes += Math.pow(y[i] - predicted, 2);
      ssTot += Math.pow(y[i] - yMean, 2);
    }

    const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    return { slope, intercept, r2 };
  }

  // Exponential smoothing for time series
  static exponentialSmoothing(values: number[], alpha: number = 0.3): number[] {
    if (values.length === 0) return [];
    
    const smoothed = [values[0]];
    for (let i = 1; i < values.length; i++) {
      smoothed.push(alpha * values[i] + (1 - alpha) * smoothed[i - 1]);
    }
    
    return smoothed;
  }

  // Moving average
  static movingAverage(values: number[], window: number): number[] {
    if (values.length < window) return values;
    
    const result: number[] = [];
    for (let i = 0; i <= values.length - window; i++) {
      const windowValues = values.slice(i, i + window);
      result.push(this.mean(windowValues));
    }
    
    return result;
  }

  // Calculate growth rate
  static growthRate(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  // Compound Annual Growth Rate (CAGR)
  static cagr(beginValue: number, endValue: number, periods: number): number {
    if (beginValue <= 0 || periods <= 0) return 0;
    return (Math.pow(endValue / beginValue, 1 / periods) - 1) * 100;
  }

  // Z-score normalization
  static zScore(value: number, mean: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  }

  // Min-max normalization
  static normalize(values: number[], min: number = 0, max: number = 1): number[] {
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;
    
    if (range === 0) return values.map(() => min);
    
    return values.map(val => 
      min + ((val - dataMin) / range) * (max - min)
    );
  }

  // Detect outliers using IQR method
  static detectOutliers(values: number[]): { outliers: number[]; bounds: { lower: number; upper: number } } {
    const q1 = this.percentile(values, 25);
    const q3 = this.percentile(values, 75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outliers = values.filter(val => val < lowerBound || val > upperBound);
    
    return {
      outliers,
      bounds: { lower: lowerBound, upper: upperBound }
    };
  }

  // Calculate confidence interval
  static confidenceInterval(
    mean: number, 
    stdDev: number, 
    sampleSize: number, 
    confidence: number = 0.95
  ): { lower: number; upper: number } {
    // Z-scores for common confidence levels
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    
    const z = zScores[confidence] || 1.96;
    const margin = z * (stdDev / Math.sqrt(sampleSize));
    
    return {
      lower: mean - margin,
      upper: mean + margin
    };
  }

  // Calculate weighted average
  static weightedAverage(values: number[], weights: number[]): number {
    if (values.length !== weights.length || values.length === 0) return 0;
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return 0;
    
    const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
    return weightedSum / totalWeight;
  }

  // Calculate ROI
  static calculateROI(benefit: number, cost: number): number {
    if (cost === 0) return 0;
    return ((benefit - cost) / cost) * 100;
  }

  // Calculate marginal ROI
  static marginalROI(
    currentBenefit: number, 
    currentCost: number, 
    additionalBenefit: number, 
    additionalCost: number
  ): number {
    if (additionalCost === 0) return 0;
    return ((additionalBenefit - additionalCost) / additionalCost) * 100;
  }

  // Sigmoid function for saturation curves
  static sigmoid(x: number, midpoint: number = 0, steepness: number = 1): number {
    return 1 / (1 + Math.exp(-steepness * (x - midpoint)));
  }

  // Logistic growth function
  static logisticGrowth(
    x: number, 
    capacity: number, 
    growthRate: number, 
    midpoint: number
  ): number {
    return capacity / (1 + Math.exp(-growthRate * (x - midpoint)));
  }

  // Calculate Pareto distribution (80/20 rule)
  static paretoAnalysis(values: number[], labels: string[]): {
    items: Array<{ label: string; value: number; cumulative: number; percentage: number }>;
    pareto80: number; // Index where 80% is reached
  } {
    if (values.length !== labels.length) {
      throw new Error('Values and labels must have the same length');
    }

    // Sort by value descending
    const sorted = values
      .map((val, i) => ({ label: labels[i], value: val }))
      .sort((a, b) => b.value - a.value);

    const total = values.reduce((sum, val) => sum + val, 0);
    let cumulative = 0;
    let pareto80 = -1;

    const items = sorted.map((item, i) => {
      cumulative += item.value;
      const percentage = (cumulative / total) * 100;
      
      if (pareto80 === -1 && percentage >= 80) {
        pareto80 = i;
      }

      return {
        label: item.label,
        value: item.value,
        cumulative,
        percentage
      };
    });

    return { items, pareto80 };
  }

  // Time series decomposition (simplified)
  static decomposeTimeSeries(
    values: number[], 
    period: number = 12
  ): {
    trend: number[];
    seasonal: number[];
    residual: number[];
  } {
    // Calculate trend using moving average
    const trend = this.movingAverage(values, period);
    
    // Calculate seasonal component
    const seasonal: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (i < trend.length) {
        seasonal.push(values[i] - trend[i]);
      } else {
        seasonal.push(0);
      }
    }
    
    // Calculate residual
    const residual = values.map((val, i) => {
      const trendVal = i < trend.length ? trend[i] : 0;
      const seasonalVal = seasonal[i] || 0;
      return val - trendVal - seasonalVal;
    });
    
    return { trend, seasonal, residual };
  }

  // Calculate elasticity
  static calculateElasticity(
    quantityChange: number, 
    priceChange: number,
    currentQuantity: number,
    currentPrice: number
  ): number {
    if (priceChange === 0 || currentPrice === 0 || currentQuantity === 0) return 0;
    
    const quantityChangePercent = (quantityChange / currentQuantity) * 100;
    const priceChangePercent = (priceChange / currentPrice) * 100;
    
    return quantityChangePercent / priceChangePercent;
  }

  // Calculate lift
  static calculateLift(
    treatmentConversion: number,
    controlConversion: number
  ): number {
    if (controlConversion === 0) return 0;
    return ((treatmentConversion - controlConversion) / controlConversion) * 100;
  }

  // Statistical significance test (simplified chi-square)
  static isSignificant(
    treatmentSuccess: number,
    treatmentTotal: number,
    controlSuccess: number,
    controlTotal: number,
    alpha: number = 0.05
  ): boolean {
    const treatmentRate = treatmentSuccess / treatmentTotal;
    const controlRate = controlSuccess / controlTotal;
    const pooledRate = (treatmentSuccess + controlSuccess) / (treatmentTotal + controlTotal);
    
    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) * (1/treatmentTotal + 1/controlTotal)
    );
    
    const zScore = Math.abs(treatmentRate - controlRate) / standardError;
    const criticalValue = alpha === 0.05 ? 1.96 : alpha === 0.01 ? 2.576 : 1.645;
    
    return zScore > criticalValue;
  }

  // Format number with commas and decimals
  static formatNumber(
    value: number, 
    decimals: number = 0, 
    prefix: string = '', 
    suffix: string = ''
  ): string {
    const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${prefix}${formatted}${suffix}`;
  }

  // Calculate percentage change
  static percentageChange(oldValue: number, newValue: number): string {
    const change = this.growthRate(oldValue, newValue);
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }
}

// Export utility functions for direct use
export const {
  mean,
  median,
  standardDeviation,
  percentile,
  correlation,
  linearRegression,
  exponentialSmoothing,
  movingAverage,
  growthRate,
  cagr,
  zScore,
  normalize,
  detectOutliers,
  confidenceInterval,
  weightedAverage,
  calculateROI,
  marginalROI,
  sigmoid,
  logisticGrowth,
  paretoAnalysis,
  decomposeTimeSeries,
  calculateElasticity,
  calculateLift,
  isSignificant,
  formatNumber,
  percentageChange
} = StatisticsUtils;