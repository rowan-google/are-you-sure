export type FactorCategory = 'emotion' | 'desire';

export type InfluenceLevel = 0 | 1 | 2 | 3;

export interface FactorItem {
  id: string;
  category: FactorCategory;
  categoryName: string;
  name: string;
  englishName: string;
  sensoryOrgan?: string; // For desires: 眼, 耳, 鼻, 舌, 身, 意
  sensoryLabel?: string; // 视觉, 听觉, 嗅觉, 味觉, 触觉, 念头
  subTitle: string; // 小字标注详细内容，比如：高兴、喜悦、亢奋、过度乐观
  description: string;
  promptQuestion: string; // 引导反问
  cognitiveTrap: string; // 认知盲区
  calmAdvice: string; // 醒脑箴言
  color: string; // Hex color code
  bgGlow: string; // Glow styling
  icon: string;
}

export interface FactorAssessment {
  factorId: string;
  level: InfluenceLevel; // 0: 无影响, 1: 轻度, 2: 明显, 3: 主导
  note?: string;
}

export interface DecisionRecord {
  id: string;
  title: string;
  timestamp: number;
  clarityScore: number; // 0 - 100
  verdict: 'clear' | 'caution' | 'danger';
  verdictText: string;
  assessments: Record<string, FactorAssessment>;
  topInfluences: string[];
  notes?: string;
}
