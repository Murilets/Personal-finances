import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TextStyle } from 'react-native';
import { customColors } from '../../constants/theme';
import { formatBRL } from '../../utils/formatters';

interface AnimatedNumberProps {
  value: number | string;
  isCurrency?: boolean;
  delay?: number;
  duration?: number;
  style?: TextStyle;
  numberOfLines?: number;
}

export default function AnimatedNumber({
  value,
  isCurrency = false,
  delay = 0,
  duration = 750,
  style,
  numberOfLines = 1,
}: AnimatedNumberProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const isNumeric = typeof value === 'number';
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (isNumeric) {
      return isCurrency ? formatBRL(0) : '0';
    }
    return String(value);
  });

  useEffect(() => {
    anim.setValue(0);

    const animation = Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();

    if (isNumeric) {
      let startTimestamp: number | null = null;
      let frameId: number;

      const timer = setTimeout(() => {
        const step = (now: number) => {
          if (startTimestamp === null) startTimestamp = now;
          const elapsed = now - startTimestamp;
          const progress = Math.min(1, elapsed / duration);
          // Easing cúbico para a contagem acompanhar o movimento
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentNumber = value * easeProgress;

          setDisplayValue(
            isCurrency ? formatBRL(currentNumber) : String(Math.round(currentNumber))
          );

          if (progress < 1) {
            frameId = requestAnimationFrame(step);
          } else {
            setDisplayValue(isCurrency ? formatBRL(value) : String(value));
          }
        };

        frameId = requestAnimationFrame(step);
      }, delay);

      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(frameId);
      };
    } else {
      setDisplayValue(String(value));
    }
  }, [value, isCurrency, delay, duration]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.Text
      numberOfLines={numberOfLines}
      style={[
        styles.text,
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {displayValue}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: customColors.text,
  },
});
