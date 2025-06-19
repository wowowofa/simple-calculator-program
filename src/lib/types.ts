export type Step = {
  value: string;
  type: 'operator' | 'operand' | 'result';
};

export type CalculationRecord = {
  id: number;
  expression: string;
  steps: Step[];
  result: number;
  timestamp: Date;
};