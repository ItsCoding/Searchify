type RecommendationOption = {
  enabled: boolean;
  target: number;
  range: Array<number>;
};

type RecommendationOptions = {
  [key: string]: RecommendationOption;
};

// export default RecommendationOptions;

export type {
    RecommendationOption,
    RecommendationOptions
}
