import { StyleSheet, Text, TextProps } from 'react-native';

import { Kalinlik, renk, yaziTipi } from '@/theme';

type Props = TextProps & {
  /** Yazı kalınlığı: 400 normal … 800 en kalın */
  k?: Kalinlik;
  /** Punto */
  b?: number;
  /** Renk */
  r?: string;
};

/** Uygulamadaki tüm yazılar bununla yazılır (Plus Jakarta Sans). */
export function Y({ k = 500, b = 16, r = renk.yazi, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[s.temel, { fontFamily: yaziTipi[k], fontSize: b, color: r }, style]}
    />
  );
}

const s = StyleSheet.create({ temel: { includeFontPadding: false } });
