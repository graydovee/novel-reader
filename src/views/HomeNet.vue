<template>
    <div>
        <el-row>
            <el-col style="text-align: center"><h3>{{title}}</h3></el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="2">
                <div class="back" @click="toNet">
                    <span class="el-icon-s-home"></span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16" :offset="4">
                <el-input placeholder="请输入内容" v-model="searchName" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-table
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="title"
                        label="书名"
                        align="center">
                    </el-table-column>

                    <el-table-column
                            prop="title"
                            label="操作"
                            align="center">
                        <template slot-scope="scope">
                            <el-button @click="list(scope.row)" type="text">详情</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import bus from '@/utils/bus'

export default {
    name: 'HomeNet',
    data() {
        return {
            tableData: [],
            searchName: '',
            loading: false,
            title: '在线搜索'
        }
    },
    methods:{
        search(){
            if (!this.searchName){
                this.title = '在线搜索'
                return
            }
            if (this.searchName.length < 2) {
                this.$message.error("关键字过短")
                return
            }
            this.loading = true

            let data = {
                name: this.searchName
            }
            this.title = '关键字：' + this.searchName
            this.$axios.post('/spider/search', data).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data
                    bus.$data.book = res.data
                } else {
                    this.$message.error("数据异常")
                }
                this.loading = false
            }).catch(() => {
                this.$message.error("请求异常")
                this.loading = false
            })
        },
        toNet(){
            this.$router.push('/')
        },
        list(row){
            bus.$data.book_s = row
            this.$router.push({
                name: 'netList',
                params: {
                    url:row.url
                }
            })
        }
    },
    created(){
        if (bus.$data.book) {
            this.tableData = bus.$data.book
        }
    }
}
</script>

<style scoped>
    .back{
        font-size: 20px;
        margin-bottom: 10px;
    }
</style>
