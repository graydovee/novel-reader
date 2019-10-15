<template>
    <div>
        <el-row>
            <el-col style="text-align: center"><h3>{{title}}</h3></el-col>
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
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="书名">
                    </el-table-column>

                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="read(scope.row)" type="text" size="small">阅读</el-button>
                            <el-button @click="list(scope.row)" type="text" size="small">章节</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row v-show="showPage">
            <el-col :span="20" :offset="2" style="text-align: center">
                <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="totalElements"
                        :page-size="size"
                        @current-change="getData"
                >
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            tableData: [],
            searchName: '',
            size: 5,
            totalElements: 0,
            showPage: true,
            title: '全部小说'
        }
    },
    methods:{
        read (row) {
            let str = localStorage.getItem('store')
            let data
            if (str) {
                data = JSON.parse(str)
            } else {
                data = {}
            }
            if(data[row.id]) {
                this.$confirm("检测到您的阅读历史，是否继续阅读", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    localStorage.setItem("store", JSON.stringify(data));
                    this.$router.push(`read/${row.id}`)
                }).catch(()=>{
                    data[row.id] = row.firstChapter
                    localStorage.setItem("store", JSON.stringify(data));
                    this.$router.push(`read/${row.id}`)
                })
            } else {
                data[row.id] = row.firstChapter
                localStorage.setItem("store", JSON.stringify(data));
                this.$router.push(`read/${row.id}`)
            }
        },
        getData(val){
            this.showPage = true
            let data = {
                index: val - 1,
                size: this.size
            }
            this.$axios.get('/book', data).then(res => {
                if (res.code === 200) {
                    this.totalElements = res.data.totalElements
                    this.tableData = res.data.content
                } else {
                    this.$message.error("数据异常")
                }
            }).catch(() => {
                this.$message.error("请求异常")
            })
        },
        search(){
            if (!this.searchName){
                this.title = '全部小说'
                this.getData(1)
                return
            }

            let data = {
                name: this.searchName
            }
            this.title = '关键字：' + this.searchName
            this.$axios.post('/find', data).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data
                    this.showPage = false
                } else {
                    this.$message.error("数据异常")
                }
            }).catch(() => {
                this.$message.error("请求异常")
            })
        },
        list(row){
            this.$router.push(`list/${row.id}`)
        }
    },
    created(){
        this.getData(1)
    }
}
</script>

<style scoped>

</style>
