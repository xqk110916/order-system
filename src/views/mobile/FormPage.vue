<template>
  <van-form @submit="submitForm">
    <div class="order-form">
      <!-- 标题 -->
      <div class="header">
        <h1>河南同发农产品有限公司销售出库单</h1>
        <div class="date">日期：{{ currentDate }}</div>
      </div>

      <!-- 客户信息 -->
      <van-cell-group :border="false">
        <!-- 客户名称 -->
        <van-field
          v-model="formData.clientName"
          label="客户名称"
          placeholder="请输入客户名称"
          :rules="[{ required: true, message: '客户名称不能为空' }]"
        >
          <template #extra>
            <van-icon name="history" @click="showHistory = true" />
          </template>
        </van-field>

        <!-- 发货基地 -->
        <van-field
          v-model="formData.base"
          label="发货基地"
          placeholder="固定地址/下拉选择"
          :rules="[{ required: true, message: '发货基地不能为空' }]"
        />
      </van-cell-group>

      <!-- 订单项 -->
      <div v-for="(item, index) in formData.orderItems" :key="index" class="order-item">
        <van-cell-group :border="false">
          <van-field
            v-model="item.name"
            label="名称"
            placeholder="请输入名称"
            :rules="[{ required: true, message: '名称不能为空' }]"
          />

          <!-- 单位选择 -->
          <van-field
            v-model="item.unit"
            label="单位"
            placeholder="请选择"
            is-link
            @click="showUnitPicker(index)"
            :rules="[{ required: true, message: '单位不能为空' }]"
          >
            <template #input>
              {{ item.unit || '请选择' }}
            </template>
          </van-field>

          <!-- 数量 -->
          <van-field
            v-model.number="item.quantity"
            label="数量"
            type="number"
            placeholder="请输入数量"
            :rules="[{ required: true, message: '数量不能为空' }]"
          />

          <!-- 单价 -->
          <van-field
            v-model.number="item.price"
            label="单价"
            type="number"
            placeholder="请输入单价"
            :rules="[{ required: true, message: '单价不能为空' }]"
          />

          <!-- 金额（自动计算） -->
          <van-field
            :model-value="calculateAmount(item)"
            label="金额"
            placeholder="自动计算"
            disabled
          />
        </van-cell-group>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <van-button type="primary" block @click="addOrderItem">添加订单</van-button>
        <van-button type="danger" block native-type="submit">提交订单</van-button>
      </div>
    </div>

    <!-- 单位选择弹窗 -->
    <van-popup
      v-model:show="isUnitPickerVisible"
      round
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="unitOptions"
        @confirm="confirmUnit"
        @cancel="isUnitPickerVisible = false"
      />
    </van-popup>
  </van-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Toast } from 'vant';

// 响应式数据
const currentDate = ref(new Date().toISOString().split('T')[0]);
const formData = reactive({
  clientName: '',
  base: '固定地址',
  orderItems: [{
    name: '',
    unit: '',
    quantity: 0,
    price: 0,
    amount: 0,
  }],
});
const isUnitPickerVisible = ref(false);
const activeItemIndex = ref(-1);

// 单位选项（对象数组格式）
const unitOptions = [
  { text: '公斤/kg', value: '公斤/kg' },
  { text: '枚', value: '枚' }
];

// 方法
const addOrderItem = () => {
  formData.orderItems.push({
    name: '',
    unit: '',
    quantity: 0,
    price: 0,
    amount: 0,
  });
};

const calculateAmount = (item) => {
  return (item.quantity * item.price).toFixed(2);
};

const showUnitPicker = (index) => {
  activeItemIndex.value = index;
  isUnitPickerVisible.value = true;
};

const confirmUnit = (selected) => {
  console.log('选中的单位:', selected);
  
  // 从对象中提取选中的值
  const selectedUnit = selected.selectedValues[0]; // 或 selected[0].value
  formData.orderItems[activeItemIndex.value].unit = selectedUnit;
  isUnitPickerVisible.value = false;
};

// 表单提交
const submitForm = async (values) => {
  // 验证订单项是否为空
  const hasEmptyItem = formData.orderItems.some(item => 
    !item.name || !item.unit || item.quantity <= 0 || item.price <= 0
  );
  if (hasEmptyItem) {
    Toast.fail('订单项存在未填写的字段');
    return;
  }

  // 提交逻辑（示例）
  console.log('提交的表单数据:', formData);
  Toast.success('提交成功');
};
</script>

<style scoped>
.order-form {
  padding: 20px;
  background: #fff;
}
.header {
  text-align: center;
  margin-bottom: 20px;
}
.header h1 {
  font-size: 18px;
  color: #333;
}
.order-item {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.button-group {
  margin-top: 20px;
}
</style>