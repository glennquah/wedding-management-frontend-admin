export enum UserRole {
  admin = "admin",
  superAdmin = "superAdmin",
  vendor = "vendor",
}

export enum WeddingTypes {
  chinese = "chinese",
  malay = "malay",
  indian = "indian",
  western = "western",
  others = "others",
}

export enum WeddingService {
  venue = "venue",
  catering = "catering",
  photography = "photography",
  decoration = "decoration",
  music = "music",
  attire = "attire",
  makeup = "makeup",
  transportation = "transportation",
}

export enum WeddingStyle {
  luxury = "luxury",
  modern = "modern",
  traditional = "traditional",
  rustic = "rustic",
}

export enum BudgetBucket {
  low = "low", // up to $10,000
  medium = "medium", // $10,000 to $30,000
  high = "high", // $30,000 to $50,000
  luxury = "luxury", // above $50,000
}

export enum GuestCountBucket {
  small = "small", // up to 50
  medium = "medium", // 50 to 150
  large = "large", // above 150
}