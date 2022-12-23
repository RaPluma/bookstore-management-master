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
        prop="bookId"
        width="50">
      </el-table-column>
      <el-table-column
        label="图书类型"
        prop="bookTypeId"
        width="50">
      </el-table-column>
      <el-table-column
        label="书名"
        prop="bookName"
        width="100">
      </el-table-column>
      <el-table-column
        label="作者"
        prop="bookAuthor"
        width="90">
      </el-table-column>
      <el-table-column
        label="封面"
        width="100">
        <template slot-scope="scope">
          <img :src=getSrc(scope.row.bookCover) alt="加载失败"
               style="height: 100px; width: 160px;border-radius: 4px">
        </template>
      </el-table-column>
      <el-table-column
        label="简介"
        prop="bookDesc"
        width="200">
      </el-table-column>
      <el-table-column
        label="价格"
        prop="bookPrice"
        width="50">
      </el-table-column>
      <el-table-column
        label="状态"
        prop="bookStatus"
        width="50">
      </el-table-column>
      <el-table-column
        label="标志"
        prop="bookDeleteFlag"
        width="50">
      </el-table-column>
      <el-table-column
        label="新书"
        prop="isNew"
        width="50">
      </el-table-column>
      <el-table-column
        label="推荐"
        prop="isRm"
        width="50">
      </el-table-column>
      <el-table-column
        label="插入时间"
        prop="createTime"
        width="100">
      </el-table-column>
      <el-table-column
        label="更改时间"
        prop="updateTime"
        width="100">
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
    <!--分页-->
    <el-pagination
      :page-size="100"
      :page-sizes="[5, 10, 20]"
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
          <el-input v-model="temp_item.bookTypeId" autocomplete="off" disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="封面">
          修改前：<br>
          <el-image :src=getSrc(temp_item.bookCover)
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
        <el-form-item :label-width="formLabelWidth" label="图书类型">
          <el-select v-model="temp_item.bookTypeId" placeholder="请选择">
            <el-option
              v-for="item in bookTypes"
              :key="item.bookTypeId"
              :label="item.bookTypeName"
              :value="item.bookTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="书名">
          <el-input v-model="temp_item.bookName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="作者">
          <el-input v-model="temp_item.bookAuthor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="简介">
          <el-input v-model="temp_item.bookDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="价格">
          <el-input v-model="temp_item.bookPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-input v-model="temp_item.bookStatus" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="标志">
          <el-input v-model="temp_item.bookDeleteFlag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="新书">
          <el-select v-model="temp_item.isNew" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="推荐">
          <el-select v-model="temp_item.isRm" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
    <el-dialog :visible.sync="addFormVisible" style="border-radius: 20px" title="新增" width="50%">
      <el-form :model="temp_item">
        <el-form-item :label-width="formLabelWidth" label="封面">
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
        <el-form-item :label-width="formLabelWidth" label="图书类型">
          <el-select v-model="temp_item.bookTypeId" placeholder="请选择">
            <el-option
              v-for="item in bookTypes"
              :key="item.bookTypeId"
              :label="item.bookTypeName"
              :value="item.bookTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="书名">
          <el-input v-model="temp_item.bookName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="作者">
          <el-input v-model="temp_item.bookAuthor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="简介">
          <el-input v-model="temp_item.bookDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="价格">
          <el-input v-model="temp_item.bookPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-input v-model="temp_item.bookStatus" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="标志">
          <el-input v-model="temp_item.bookDeleteFlag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="新书">
          <el-select v-model="temp_item.isNew" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="推荐">
          <el-select v-model="temp_item.isRm" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  name: 'newBookView',
  computed: {},
  data() {
    return {
      open2() {
        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        })
      },
      open4() {
        this.$message.error('错了哦，这是一条错误消息')
      },
      options: [{
        value: 0,
        label: '否'
      }, {
        value: 1,
        label: '是'
      }],
      bookTypes: [
        {
          bookTypeId: 1,
          bookTypeName: '教材'
        }
      ],
      value: '',
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
        bookTypeId: 0,
        bookName: '',
        bookAuthor: '',
        bookCover: '',
        bookDesc: '',
        bookPrice: 0,
        bookStatus: 0,
        bookDeleteFlag: 0,
        createTime: '',
        updateTime: '',
        isNew: 1,
        isRm: 0
      },
      coupons: [
        {
          bookId: 0,
          bookTypeId: 0,
          bookName: '',
          bookAuthor: '',
          bookCover: '',
          bookDesc: '',
          bookPrice: 0,
          bookStatus: 0,
          bookDeleteFlag: 0,
          createTime: '',
          updateTime: '',
          isNew: 0,
          isRm: null
        }
      ],
      temp_data: ''
    }
  },
  methods: {
    queryBookTypes() {
      const url = this.baseUrl + '/bookType/queryAll'
      // 发送请求:将数据返回到一个回到函数中
      const that = this
      // 并且响应成功以后会执行then方法中的回调函数
      axios.get(url).then(function (result) {
        that.bookTypes = result.data.data
        console.log(that.bookTypes)
      })
    },
    queryAll() {
      const url = this.baseUrl + '/newBooks/queryAll'
      // 发送请求:将数据返回到一个回到函数中
      const that = this
      // 并且响应成功以后会执行then方法中的回调函数
      axios.get(url).then(function (result) {
        that.coupons = result.data.data
      })
    },
    queryPaging() {
      const url = this.baseUrl + '/newBooks/queryByPage?pageNum=' + this.currentPage + '&pageSize=' + this.pageSize
      // 发送请求:将数据返回到一个回到函数中
      const that = this
      // 并且响应成功以后会执行then方法中的回调函数
      axios.get(url).then(function (result) {
        that.coupons = result.data.data.list
        that.total = result.data.data.total
      })
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
    getSrc(iconPath) {
      return this.baseUrl + iconPath
    },
    handleAdd() {
      this.addFormVisible = true
      this.temp_item = {
        bookTypeId: 1,
        bookName: '',
        bookAuthor: '',
        bookCover: '',
        bookDesc: '',
        bookPrice: 0,
        bookStatus: 0,
        bookDeleteFlag: 0,
        createTime: '',
        updateTime: '',
        isNew: 1,
        isRm: 0
      }
    },
    handleEdit(item) {
      console.log(item)
      this.temp_item = item
      // this.$forceUpdate()
    },
    handleDelete(item) {
      const that = this
      axios.delete(this.baseUrl + '/books/deleteById', {
        params: {id: item.bookId}
      }).then(function (response) {
        console.log(JSON.stringify(response.data))
        that.open2()
        that.queryPaging()
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleEditConfirm(item) {
      const that = this
      item.bookCover = this.temp_data.data[0]
      console.log(item.bookCover)
      const data = JSON.stringify(item)
      console.log(data)
      const config = {
        method: 'put',
        url: this.baseUrl + '/books/update',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          that.open2()
          that.queryPaging()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleAddConfirm(item) {
      const that = this
      item.bookCover = this.temp_data.data[0]
      const data = JSON.stringify(item)
      console.log(data)
      const config = {
        method: 'post',
        url: this.baseUrl + '/books/insert',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          that.queryPaging()
          that.open2()
        })
        .catch(function (error) {
          that.open4()
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
    this.queryBookTypes()
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
