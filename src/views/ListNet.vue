<template>
    <div>
        <el-row>
            <el-col style="text-align: center"><h1>章节目录</h1></el-col>
        </el-row>
        <el-row>
            <el-col :span="20" :offset="2">
                <el-table
                        :data="tableData"
                        style="width: 100%"
                        v-loading="loading">
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
        <div class="back" @click="back">
            <span class="el-icon-arrow-left"></span>
        </div>
    </div>
</template>

<script>
    import bus from '@/utils/bus'
    export default {
        name: 'List',
        data() {
            return {
                info: {},
                tableData: [],
                loading: true,
                url: '',
            }
        },
        methods:{
            read (row) {
                bus.$data.chapter_s = row
                this.$router.push({
                    name: 'netRead',
                    params: {
                        url:row.url
                    }
                })
            },
            getData(){
                let data = {
                    url: this.url
                }
                this.$axios.post('/spider/index', data).then(res => {
                    if (res.code === 200) {
                        this.info = res.data;
                        bus.$data.chapter = res.data
                        this.tableData = this.info.chapters
                    } else {
                        this.$message.error("数据异常")
                    }
                    this.loading = false;
                }).catch(() => {
                    this.$message.error("请求异常")
                    this.loading = false;
                })
            },
            back() {
                this.$router.push('/net')
            }
        },
        created(){
            this.url = this.$route.params.url
            if (this.url){
                this.getData()
            } else {

                if (bus.$data.book) {
                    this.info = bus.$data.chapter
                    this.tableData = this.info.chapters
                    this.loading = false
                } else{
                    this.$message.error("无效跳转")
                    this.loading = false;
                }
            }
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
