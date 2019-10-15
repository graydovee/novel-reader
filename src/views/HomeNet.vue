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
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="书名">
                    </el-table-column>

                    <el-table-column
                            prop="author"
                            label="作者">
                    </el-table-column>

                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button @click="list(scope.row)" type="text" size="small">章节</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
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
            if (!this.searchName && this.search().length<2){
                this.title = '在线搜索'
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
                } else {
                    this.$message.error("数据异常")
                }
                this.loading = false
            }).catch(() => {
                this.$message.error("请求异常")
                this.loading = false
            })
        },
        list(row){
            this.$router.push({
                name: 'netList',
                params: {
                    url:row.url
                }
            })
        }
    },
    created(){
    }
}
</script>

<style scoped>

</style>
