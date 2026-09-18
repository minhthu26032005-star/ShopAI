import React, { useState, useCallback, useReducer } from 'react';
import { View, StyleSheet } from 'react-native';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import { useCountdown } from '@hooks/useCountdown';
import { useTheme } from '@contexts/ThemeContext';
import { SIZES } from '@constants/theme';

// Type và Reducer cho quản lý số lượng
type QtyAction = { type: 'ADD' } | { type: 'REMOVE' };

function qtyReducer(state: number, action: QtyAction): number {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    case 'REMOVE':
      return Math.max(1, state - 1); // Không cho giảm xuống dưới 1
    default:
      return state;
  }
}

const UNIT_PRICE = 15000000;

const HomeScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme(); // Lấy bộ màu + hàm chuyển Theme
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const { timeLeft, isFinished } = useCountdown(60);

  // Quản lý số lượng bằng useReducer
  const [quantity, dispatchQty] = useReducer(qtyReducer, 1);

  const totalPrice = (UNIT_PRICE * quantity).toLocaleString('vi-VN');

  const handleCheckout = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Thanh toán thành công!', { coupon, quantity, total: UNIT_PRICE * quantity });
    }, 2000);
  }, [coupon, quantity]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h1" color={colors.text} style={styles.title}>
        ShopAI UI Kit
      </Typography>

      {/* Nút chuyển đổi Theme Sáng / Tối */}
      <ShopButton
        title={isDark ? 'Chuyển sang Sáng ☀️' : 'Chuyển sang Tối 🌙'}
        onPress={toggleTheme}
        variant="secondary"
        style={{ marginBottom: 16 }}
      />

      <Typography
        variant="body2"
        color={colors.textLight}
        style={{ textAlign: 'center', marginBottom: 16 }}
      >
        {isFinished
          ? 'Đã hết hạn khuyến mãi!'
          : `Flash sale kết thúc sau: ${timeLeft}s`}
      </Typography>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Typography variant="h2" color={colors.primary} style={styles.price}>
          Tổng tiền: {totalPrice}đ
        </Typography>

        <ShopInput
          label="Mã giảm giá"
          placeholder="Nhập mã (VD: SHOPAI10)"
          value={coupon}
          onChangeText={setCoupon}
          autoCapitalize="characters"
        />

        {/* Cụm tăng giảm số lượng sử dụng ShopButton và useReducer */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ShopButton
            title="-"
            onPress={() => dispatchQty({ type: 'REMOVE' })}
            style={{ width: 44, height: 44 }}
          />
          <Typography variant="h3" color={colors.text} style={{ marginHorizontal: 20 }}>
            {quantity}
          </Typography>
          <ShopButton
            title="+"
            onPress={() => dispatchQty({ type: 'ADD' })}
            style={{ width: 44, height: 44 }}
          />
        </View>

        <ShopButton
          title="Xác nhận thanh toán"
          onPress={handleCheckout}
          isLoading={loading}
          disabled={isFinished}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  title: { textAlign: 'center', marginBottom: 12 },
  card: {
    padding: 20,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  price: { marginBottom: 20, textAlign: 'center' },
});

export default HomeScreen;