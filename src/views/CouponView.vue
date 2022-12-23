<template>
  <div class="data-map">
    <el-button class="add-btn" round @click="handleAdd">添加</el-button>
    <el-table
      :cell-style="{ textAlign: 'center' }"
      :data="coupons"
      :header-cell-style="{ textAlign: 'center' }"
      height="600"
      style="border-radius: 8px"
    >
      <el-table-column
        label="ID"
        prop="couponId"
        width="120">
      </el-table-column>
      <el-table-column
        label="图片"
        width="200">
        <template slot-scope="scope">
          <img :src=getSrc(scope.row.couponImages) alt="加载失败"
               style="height: 100px; width: 160px;border-radius: 4px">
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        prop="couponDesc"
        width="300">
      </el-table-column>
      <el-table-column
        label="价值"
        prop="couponValue"
        width="50">
      </el-table-column>
      <el-table-column
        label="是否可用"
        prop="couponAvailable"
        width="50">
      </el-table-column>
      <el-table-column
        label="插入时间"
        prop="createTime"
        width="150">
      </el-table-column>
      <el-table-column
        label="更改时间"
        prop="updateTime"
        width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row) ;editFormVisible = true">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="100"
      :page-sizes="[5, 10]"
      :total=this.total
      background
      layout="total, sizes, prev, pager, next, jumper"
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
    <!-- 编辑弹框 -->
    <el-dialog :visible.sync="editFormVisible" style="border-radius: 4px" title="修改" width="50%">
      <el-form :model="temp_item">
        <el-form-item :label-width="formLabelWidth" label="ID">
          <el-input v-model="temp_item.couponId" autocomplete="off" disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="图片">
          修改前：<br>
          <el-image :src=getSrc(temp_item.couponImages)
                    style="height: 150px;width: 150px;border-radius: 4px"></el-image>
          <br>
          修改后：
          <br>
          <el-upload
            :auto-upload="false"
            :limit="1"
            :on-change="handleChange"
            action="#"
            list-type="picture-card"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述">
          <el-input v-model="temp_item.couponDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="价值">
          <el-input v-model="temp_item.couponValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="可用">
          <el-input v-model="temp_item.couponAvailable" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger"
                   @click="editFormVisible = false"
        >取 消
        </el-button>
        <el-button type="primary"
                   @click="editFormVisible = false;
                   handleEditConfirm(temp_item)"
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <!--新增-->
    <el-dialog :visible.sync="addFormVisible" style="border-radius: 4px" title="新增" width="50%">
      <el-form :model="temp_item">
        <el-form-item :label-width="formLabelWidth" label="图片">
          <el-upload
            :auto-upload="false"
            :limit="1"
            :on-change="handleChange"
            action="#"
            list-type="picture-card"
          >
            <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述">
          <el-input v-model="temp_item.couponDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="价值">
          <el-input v-model="temp_item.couponValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="可用">
          <el-input v-model="temp_item.couponAvailable" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger"
                   @click="addFormVisible = false"
        >取 消
        </el-button>
        <el-button type="primary"
                   @click="addFormVisible = false;
                   handleAddConfirm(temp_item)"
        >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'CouponView',
  computed: {},
  data() {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 10,
      pageCount: 0,
      uid: 13,
      baseUrl: 'http://43.139.97.111:8080',
      editFormVisible: false,
      addFormVisible: false,
      formLabelWidth: '80px',
      dialogImageUrl: '',
      disabled: false,
      dialogVisible: false,
      temp_item: {
        couponImages: '',
        couponDesc: '',
        couponValue: 0,
        couponAvailable: ''
      },
      coupons: [
        {
          couponId: '',
          couponImages: '',
          couponDesc: '',
          couponValue: '',
          couponAvailable: '',
          createTime: '',
          updateTime: ''
        }
      ],
      temp_data: ''
    }
  },
  methods: {
    queryAll() {
      const url = this.baseUrl + '/coupon/queryAll'
      // 发送请求:将数据返回到一个回到函数中
      const that = this
      // 并且响应成功以后会执行then方法中的回调函数
      axios.get(url).then(function (result) {
        that.coupons = result.data.data
      })
    },
    queryPaging() {
      const url = this.baseUrl + '/coupon/queryByPage?pageNum=' + this.currentPage + '&pageSize=' + this.pageSize
      // 发送请求:将数据返回到一个回到函数中
      const that = this
      // 并且响应成功以后会执行then方法中的回调函数
      axios.get(url).then(function (result) {
        that.coupons = result.data.data.list
        that.total = result.data.data.total
      })
    },
    getSrc(iconPath) {
      return this.baseUrl + iconPath
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.queryPaging()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.queryPaging()
    },
    handleAdd() {
      this.addFormVisible = true
      this.temp_item = {
        couponImages: '',
        couponDesc: '',
        couponValue: 0,
        couponAvailable: '1',
        createTime: '',
        updateTime: ''
      }
    },
    handleEdit(item) {
      console.log(item)
      this.temp_item = item
      // this.$forceUpdate()
    },
    handleDelete(item) {
      const that = this
      axios.delete(this.baseUrl + '/coupon/deleteById', {
        params: {id: item.couponId}
      }).then(function (response) {
        console.log(JSON.stringify(response.data))
        that.queryPaging()
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleEditConfirm(item) {
      const that = this
      item.couponImages = this.temp_data.data[0]
      const data = JSON.stringify(item)
      console.log(data)
      const config = {
        method: 'put',
        url: this.baseUrl + '/coupon/update',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          that.queryAll()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleAddConfirm(item) {
      const that = this
      item.couponImages = this.temp_data.data[0]
      const data = JSON.stringify(item)
      console.log(data)
      const config = {
        method: 'post',
        url: this.baseUrl + '/coupon/insert',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          that.queryPaging()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleChange(file) {
      const fd = new FormData()
      fd.append('files', file.raw)// 传文件
      fd.append('uid', this.uid)// id
      axios
        .post(this.baseUrl + '/files/upload', fd, {headers: {'content-type': 'multipart/form-data'}})
        .then(res => {
          console.log(res.data.data[0])
          this.temp_data = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.queryPaging()
  }
  // ,
  // updated () {
  //   this.queryAll()
  // }
}
</script>
<style lang="less" scoped>
.data-map {
  background-color: #1ccdae;
  padding: 10px;
  border-radius: 8px;
}

.add-btn {
  padding: 6px 15px;
  width: 80px;
  margin: 0 0 10px 8px;
  tab-size: 20px;
}

.add-btn:hover {
  color: white;
  font-weight: 500;
  background-color: #e82c5f;
}
</style>
