
export type IconShape = 'square' | 'rounded' | 'circle';

export interface IconConfig {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontVariant: string;
  fontWeight: string;
  fontColor: string;
  backgroundColor: string;
  shape: IconShape;
  useIcon: boolean;
  iconName: string;
}

export interface GoogleFont {
  family: string;
  variants: string[];
}
