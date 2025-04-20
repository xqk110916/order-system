<template>
  <van-form @submit="submitForm">
    <div class="order-form">
      <!-- 标题 -->
      <div class="header">
        <h1>河南同发农产品有限公司销售出库单</h1>
        <div class="date">
          日期：
          <span @click="showCalendar = true">{{ currentDate }}</span>
        </div>
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

        <!-- 制单 -->
        <van-field
          v-model="formData.maker"
          label="制单"
          placeholder="请输入制单人员"
        />

        <!-- 业务 -->
        <van-field
          v-model="formData.business"
          label="业务"
          placeholder="请输入业务人员"
          :rules="[{ required: true, message: '业务人员不能为空' }]"
        />

        <!-- 发货基地 -->
        <van-field
          v-model="formData.base"
          label="发货基地"
          placeholder="固定地址"
          :rules="[{ required: true, message: '发货基地不能为空' }]"
        />
      </van-cell-group>

      <!-- 订单项 -->
      <div
        v-for="(item, index) in formData.orderItems"
        :key="index"
        class="order-item"
      >
        <van-cell-group :border="false">
          <!-- 品类名称（下拉选择） -->
          <van-field
            v-model="item.categoryName"
            label="品类名称"
            placeholder="请选择品类"
            is-link
            @click="openPicker(index, 'category')"
            @change="onCategoryChange(index)"
            :rules="[{ required: true, message: '品类名称不能为空' }]"
          >
            <template #input>
              {{ item.categoryName || "请选择" }}
            </template>
          </van-field>

          <!-- 单位选择 -->
          <van-field
            v-model="item.unit"
            label="单位"
            placeholder="请选择"
            is-link
            @click="openPicker(index, 'unit')"
            :rules="[{ required: true, message: '单位不能为空' }]"
          >
            <template #input>
              {{ item.unit || "请选择" }}
            </template>
          </van-field>

          <!-- 规格 -->
          <van-field
            v-if="item.unit === '箱装' || item.unit === '打码箱装'"
            v-model.number="item.size"
            label="每箱规格"
            type="number"
            placeholder="请输入规格,如360"
            :rules="[{ required: true, message: '规格不能为空' }]"
          />

          <!-- 重量 -->
          <van-field
            v-if="item.unit === '散装'"
            v-model.number="item.weight"
            label="重量(公斤/kg)"
            type="number"
            placeholder="请输入重量"
            :rules="[{ required: true, message: '重量不能为空' }]"
          />

          <!-- 数量 -->
          <van-field
            v-model.number="item.quantity"
            label="出库数量"
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
          />

          <!-- 包装箱 -->
          <van-field
            v-model.number="item.boxName"
            label="包装箱"
            type="text"
            placeholder="请输入包装箱名称"
          />

          <!-- 备注 -->
          <van-field
            v-model.number="item.remark"
            label="备注"
            type="textarea"
            placeholder="请输入备注"
            rows="1"
            autosize
          />
        </van-cell-group>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <van-button type="primary" block @click="addOrderItem"
          >添加订单</van-button
        >
        <van-button type="danger" block native-type="submit"
          >提交订单</van-button
        >
      </div>
    </div>

    <!-- 下拉选择弹窗 -->
    <van-popup v-model:show="isPickerVisible" round position="bottom">
      <van-picker
        show-toolbar
        :columns="pickerColums"
        @confirm="onPickerConfirm"
        @cancel="isPickerVisible = false"
      />
    </van-popup>

    <!-- 日历组件 -->
    <van-calendar
      v-model:show="showCalendar"
      :default-date="currentDateValue"
      :min-date="new Date(2000, 0, 1)"
      :max-date="new Date()"
      @confirm="onDateConfirm"
    />
  </van-form>

  <van-dialog
    v-model:show="dialogVisible"
    title="出库单"
    :beforeClose="closeDialog"
    destroyOnClose
  >
    <van-image
      width="100%"
      height="100%"
      :src="imageSrc"
      @click="previewImage"
    />
  </van-dialog>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  showDialog,
  showImagePreview,
  showToast,
  showSuccessToast,
  showFailToast,
} from "vant";

// 响应式数据
const currentDateValue = ref(new Date());
const currentDate = computed(() => {
  const date = currentDateValue.value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
});
const formData = reactive({
  clientName: "测试用户",
  maker: "秦新纬", // 制单默认值
  business: "22", // 业务字段初始化
  base: "西平基地",
  // 添加日期字段
  date: currentDate.value,
  orderItems: [
    {
      categoryName: "",
      size: 360,
      unit: "",
      weight: 0,
      quantity: 0,
      price: 0,
      amount: 0, // 初始金额
      boxName: "",
      remark: "",
    },
  ],
});
const dialogVisible = ref(false);
const imageSrc = ref("");
const isPickerVisible = ref(false);
const activeItemIndex = ref(-1);
const currentPicker = ref("");
const showCalendar = ref(false);

// 品类选项（对象数组格式）
const categoryOptions = [
  { text: "合格蛋", value: "合格蛋" },
  { text: "双黄蛋", value: "双黄蛋" },
  { text: "破蛋", value: "破蛋" },
  { text: "次蛋", value: "次蛋" },
];

// 单位选项（对象数组格式）
const unitOptions = [
  { text: "箱装", value: "箱装" },
  { text: "打码箱装", value: "打码箱装" },
  { text: "散装", value: "散装" },
];

const pickerColums = computed(() => {
  if (currentPicker.value === "category") {
    return [categoryOptions];
  } else if (currentPicker.value === "unit") {
    return [unitOptions];
  }
  return [];
});

// 方法
const addOrderItem = () => {
  formData.orderItems.push({
    categoryName: "",
    unit: "",
    quantity: 0,
    price: 0,
    amount: 0,
  });
};

const calculateAmount = (item) => {
  if (item.unit === "散装") {
    item.amount = (item.weight * item.price).toFixed(2); // 更新金额字段
    return item.amount;
  } else {
    item.amount = (item.quantity * item.price).toFixed(2); // 更新金额字段
    return item.amount;
  }
};

const openPicker = (index, pickerType) => {
  activeItemIndex.value = index;
  currentPicker.value = pickerType;
  isPickerVisible.value = true;
};

const onPickerConfirm = (selected) => {
  console.log("selected", selected);
  const selectedValue = selected.selectedValues[0];
  if (currentPicker.value === "category") {
    formData.orderItems[activeItemIndex.value].categoryName = selectedValue;
    // 根据品类设置默认单位
    onCategoryChange(selectedValue);
  } else if (currentPicker.value === "unit") {
    formData.orderItems[activeItemIndex.value].unit = selectedValue;
    onUnitChange(selectedValue);
  }
  // 选择后重新计算金额
  calculateAmount(formData.orderItems[activeItemIndex.value]);
  isPickerVisible.value = false;
};

const onDateConfirm = (date) => {
  currentDateValue.value = date;
  // 更新 formData 中的日期
  formData.date = currentDate.value;
  showCalendar.value = false;
};

// 监听品类选择变化
// 合格蛋默认为箱装, 其他均为散装
const onCategoryChange = (value) => {
  console.log("selectedValue", value);
  switch (value) {
    case "合格蛋":
      formData.orderItems[activeItemIndex.value].unit = "箱装";
      break;
    default:
      formData.orderItems[activeItemIndex.value].unit = "散装";
      formData.orderItems[activeItemIndex.value].quantity = 0;
      break;
  }
};
const onUnitChange = (value) => {
  console.log("selectedValue", value);
  switch (value) {
    case "散装":
      formData.orderItems[activeItemIndex.value].quantity = 0;
  }
};

// 生成测试数据
const generateTestData = () => {
  addOrderItem();
  formData.orderItems.forEach((item) => {
    item.categoryName = "合格蛋";
    item.unit = "箱装";
    item.quantity = 1;
    item.size = 360;
    item.price = 1;
    item.boxName = "口感蛋";
    item.remark = "无";
  });
};
generateTestData();

const clearFormData = () => {
  formData.clientName = "";
  formData.maker = "秦新纬";
  formData.business = "";
  formData.base = "";
  formData.date = currentDate.value;
  formData.orderItems = [
    {
      categoryName: "",
      size: 360,
      unit: "",
      weight: 0,
      quantity: 0,
      price: 0,
      amount: 0,
      boxName: "",
      remark: "",
    },
  ];
};

const closeDialog = (action) => {
  console.log("action");
  showDialog({
    title: '提示',
    message: '是否清除表单数据并跳转至列表页?',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    // 用户点击确认，清除表单数据并关闭弹窗
    clearFormData();
    dialogVisible.value = false;
    return true
  }).catch(() => {
    // 用户点击取消，正常关闭弹窗
    dialogVisible.value = false;
  });
};

// 修改 previewImage 方法
const previewImage = () => {
  showImagePreview([imageSrc.value]);
};

import { saveOrder } from "@/api/index.js";

const submitForm = async (values) => {
  // 验证订单项是否为空
  // const hasEmptyItem = formData.orderItems.some(item =>
  //   !item.categoryName || !item.unit || item.quantity <= 0 || item.price <= 0
  // );
  // if (hasEmptyItem) {
  //   showFailToast('订单项存在未填写的字段');
  //   return;
  // }

  // 提交逻辑（示例）
  console.log("提交的表单数据:", formData);
  saveOrder(formData).then((res) => {
    console.log("res", res);
    showSuccessToast("提交成功");
    dialogVisible.value = true;
    imageSrc.value = "data:image/png;base64," + res.data;
  });
  // Toast.success('提交成功');
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
.date span {
  color: blue;
  cursor: pointer;
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
