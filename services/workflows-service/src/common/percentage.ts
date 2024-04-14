export class Percentage {
  /**
   * Value of the percentage in the range of 0 to 100
   * @example 50
   */
  private value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Create a new percentage from a decimal value
   * @param decimal - The decimal value to convert to a percentage (0.5 = 50%)
   */
  public static fromDecimal(decimal: number): Percentage {
    return new Percentage(decimal * 100);
  }

  /**
   * Create a new percentage from a percentage value
   * @param percentage - The percentage value (50 = 50%)
   */
  public static fromPercentage(percentage: number): Percentage {
    return new Percentage(percentage);
  }

  /**
   * Returns the decimal value of the percentage
   * @example 0.5 in case of 50%
   */
  public toDecimal(): number {
    return this.value / 100;
  }

  /**
   * Returns the percentage value
   * @example 50 in case of 50%
   */
  public toPercentage(): number {
    return this.value;
  }
}
