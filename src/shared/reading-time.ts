export interface ReadingTimeInfo {
  originalWordCount: number;
  summaryWordCount: number;
  originalReadingTimeMinutes: number;
  summaryReadingTimeMinutes: number;
  timeSavedMinutes: number;
  timeSavedPercentage: number;
}

/**
 * Calculates reading time for text based on average reading speed
 * Average reading speed: 150-200 words per minute for web content
 * We use 180 words per minute as a realistic middle ground for online reading
 */
export class ReadingTimeCalculator {
  private static readonly WORDS_PER_MINUTE = 180;

  /**
   * Count words in text
   */
  static countWords(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }

    // Split by whitespace and filter out empty strings
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Calculate reading time in minutes
   */
  static calculateReadingTime(wordCount: number): number {
    if (wordCount <= 0) {
      return 0;
    }

    const minutes = wordCount / this.WORDS_PER_MINUTE;
    // Round to 1 decimal place, minimum 0.1 minutes
    return Math.max(0.1, Math.round(minutes * 10) / 10);
  }

  /**
   * Calculate comprehensive reading time information
   */
  static calculateReadingTimeInfo(
    originalText: string,
    summaryText: string,
  ): ReadingTimeInfo {
    const originalWordCount = this.countWords(originalText);
    const summaryWordCount = this.countWords(summaryText);

    const originalReadingTimeMinutes =
      this.calculateReadingTime(originalWordCount);
    const summaryReadingTimeMinutes =
      this.calculateReadingTime(summaryWordCount);

    const timeSavedMinutes = Math.max(
      0,
      originalReadingTimeMinutes - summaryReadingTimeMinutes,
    );
    const timeSavedPercentage =
      originalReadingTimeMinutes > 0
        ? Math.round((timeSavedMinutes / originalReadingTimeMinutes) * 100)
        : 0;

    return {
      originalWordCount,
      summaryWordCount,
      originalReadingTimeMinutes,
      summaryReadingTimeMinutes,
      timeSavedMinutes,
      timeSavedPercentage,
    };
  }

  /**
   * Format reading time for display
   */
  static formatReadingTime(minutes: number): string {
    if (minutes < 1) {
      return "< 1 min";
    } else if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      if (remainingMinutes === 0) {
        return `${hours} hr`;
      }
      return `${hours} hr ${remainingMinutes} min`;
    }
  }

  /**
   * Format time saved for display
   */
  static formatTimeSaved(minutes: number, percentage: number): string {
    const timeStr = this.formatReadingTime(minutes);
    return `${timeStr} (${percentage}%)`;
  }
}
