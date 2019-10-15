<template>
    <div>
        <el-row>
            <el-col style="text-align: center"><h1>章节目录</h1></el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="title"
                            label="章节名">
                    </el-table-column>

                    <el-table-column
                            label="操作"
                    width="50">
                        <template slot-scope="scope">
                            <el-button @click="read(scope.row)" type="text" size="small">阅读</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col style="text-align: center">
                <el-pagination
                        small
                        layout="prev, pager, next"
                        :current-page.sync="currentPage"
                        :total="totalElements"
                        :page-size="size"
                        @current-change="getData"
                >
                </el-pagination>
            </el-col>
        </el-row>
        <el-row>
            <el-col style="text-align: center">
                <el-pagination
                        small
                        layout="total,jumper"
                        :current-page.sync="currentPage"
                        :total="totalElements"
                        :page-size="size"
                        @current-change="getData"
                >
                </el-pagination>
            </el-col>
        </el-row>
        <div class="back" @click="back">
            <span class="el-icon-arrow-left"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'List',
        data() {
            return {
                bookId: 0,
                tableData: [],
                searchName: '',
                size: 5,
                totalElements: 0,
                currentPage: 1,
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
                data[this.bookId] = row.id
                localStorage.setItem("store", JSON.stringify(data));
                this.$router.push(`/read/${this.bookId}`)
            },
            getData(val){
                let data = {
                    bookId: this.bookId,
                    pageIndex: val - 1,
                    pageSize: this.size
                }
                this.$axios.get('/chapter', data).then(res => {
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
            back() {
                this.$router.push('/')
            }
        },
        created(){
            this.bookId = this.$route.params.bookId;
            if(this.bookId)
                this.getData(1)
        }
    }
</script>

<style scoped>
.back{
    position: fixed;
    top: 5vh;
    left: 6vh;
    font-size: 20px;
}
</style>
