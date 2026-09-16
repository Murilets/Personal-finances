import { useEffect, useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { DEFAULT_CATEGORY_COLORS } from '../constants/categoryColors';

export function hsvToHex(h: number, s: number, v: number): string {
  s = Math.max(0, Math.min(1, s));
  v = Math.max(0, Math.min(1, v));
  h = ((h % 360) + 360) % 360;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  if (c.length !== 6) return { h: 160, s: 0.85, v: 0.75 };

  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h = h * 60;
  }

  return { h, s, v };
}

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [panelLayout, setPanelLayout] = useState({ width: 0, height: 110 });
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    const nextHsv = hexToHsv(value);
    setHsv(nextHsv);
  }, [value]);

  const pureHueHex = useMemo(() => hsvToHex(hsv.h, 1, 1), [hsv.h]);

  const handlePanelTouch = (evt: GestureResponderEvent) => {
    if (panelLayout.width <= 0 || panelLayout.height <= 0) return;
    const x = Math.max(0, Math.min(panelLayout.width, evt.nativeEvent.locationX));
    const y = Math.max(0, Math.min(panelLayout.height, evt.nativeEvent.locationY));
    const s = x / panelLayout.width;
    const v = 1 - y / panelLayout.height;
    const nextHsv = { ...hsv, s, v };
    setHsv(nextHsv);
    onChange(hsvToHex(nextHsv.h, nextHsv.s, nextHsv.v));
  };

  const handleHueTouch = (evt: GestureResponderEvent) => {
    if (sliderWidth <= 0) return;
    const x = Math.max(0, Math.min(sliderWidth, evt.nativeEvent.locationX));
    const newHue = Math.round((x / sliderWidth) * 360) % 360;
    const nextHsv = { ...hsv, h: newHue };
    setHsv(nextHsv);
    onChange(hsvToHex(nextHsv.h, nextHsv.s, nextHsv.v));
  };

  const panelPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => handlePanelTouch(evt),
        onPanResponderMove: (evt) => handlePanelTouch(evt),
      }),
    [panelLayout, hsv]
  );

  const sliderPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => handleHueTouch(evt),
        onPanResponderMove: (evt) => handleHueTouch(evt),
      }),
    [sliderWidth, hsv]
  );

  const panelThumbX = panelLayout.width > 0 ? hsv.s * panelLayout.width : 0;
  const panelThumbY = panelLayout.height > 0 ? (1 - hsv.v) * panelLayout.height : 0;
  const hueThumbX = sliderWidth > 0 ? (hsv.h / 360) * sliderWidth : 0;

  return (
    <View style={styles.container}>
      {/* 2D Panel (Saturação x Brilho) */}
      <View
        style={styles.panelContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setPanelLayout({ width, height });
        }}
        {...panelPan.panHandlers}
      >
        <Svg width="100%" height={110} style={styles.svgBorder}>
          <Defs>
            <LinearGradient id="satGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="valGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={8} fill={pureHueHex} />
          <Rect width="100%" height="100%" rx={8} fill="url(#satGradient)" />
          <Rect width="100%" height="100%" rx={8} fill="url(#valGradient)" />
        </Svg>

        {panelLayout.width > 0 && (
          <View
            pointerEvents="none"
            style={[
              styles.panelThumb,
              {
                left: Math.max(0, Math.min(panelLayout.width - 16, panelThumbX - 8)),
                top: Math.max(0, Math.min(panelLayout.height - 16, panelThumbY - 8)),
                backgroundColor: value,
              },
            ]}
          />
        )}
      </View>

      {/* Hue Slider (Barra de Matiz) */}
      <View
        style={styles.sliderContainer}
        onLayout={(e) => {
          setSliderWidth(e.nativeEvent.layout.width);
        }}
        {...sliderPan.panHandlers}
      >
        <Svg width="100%" height={20} style={styles.svgBorder}>
          <Defs>
            <LinearGradient id="hueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF0000" />
              <Stop offset="17%" stopColor="#FFFF00" />
              <Stop offset="33%" stopColor="#00FF00" />
              <Stop offset="50%" stopColor="#00FFFF" />
              <Stop offset="67%" stopColor="#0000FF" />
              <Stop offset="83%" stopColor="#FF00FF" />
              <Stop offset="100%" stopColor="#FF0000" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={10} fill="url(#hueGradient)" />
        </Svg>

        {sliderWidth > 0 && (
          <View
            pointerEvents="none"
            style={[
              styles.sliderThumb,
              {
                left: Math.max(0, Math.min(sliderWidth - 16, hueThumbX - 8)),
                backgroundColor: pureHueHex,
              },
            ]}
          />
        )}
      </View>

      {/* Paleta de Cores Rápidas (Swatches perfeitamente alinhados à barra) */}
      <View style={styles.swatchesContainer}>
        {DEFAULT_CATEGORY_COLORS.map((preset) => {
          const isSelected = preset.toUpperCase() === value.toUpperCase();
          return (
            <Pressable
              key={preset}
              onPress={() => {
                onChange(preset);
                setHsv(hexToHsv(preset));
              }}
              style={[
                styles.swatch,
                { backgroundColor: preset },
                isSelected && styles.swatchSelected,
              ]}
              hitSlop={4}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 4,
  },
  panelContainer: {
    height: 100,
    width: '100%',
    position: 'relative',
    cursor: 'pointer',
  },
  svgBorder: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  panelThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 4,
  },
  sliderContainer: {
    height: 20,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  sliderThumb: {
    position: 'absolute',
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 4,
  },
  swatchesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
    paddingVertical: 2,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  swatchSelected: {
    borderWidth: 2,
    borderColor: '#0F172A',
    transform: [{ scale: 1.15 }],
  },
});
