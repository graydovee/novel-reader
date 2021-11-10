<template>
    <div>
        <el-row>
            <el-col style="text-align: center"><h3>{{title}}</h3></el-col>
        </el-row>
        <el-row>
            <el-col :offset="2" :span="2">
                <div class="back" @click="toNet">
                    <span class="el-icon-s-promotion"></span>
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
        <el-row>
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
        <p id="license" v-if="isPC"><a href='https://beian.miit.gov.cn/' target="_blank">浙ICP备18017400号-4</a></p>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            tableData: [],
            searchName: '',
            findStr: '',
            size: 5,
            totalElements: 0,
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
            let data = {
                index: val - 1,
                size: this.size,
                name: this.findStr
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
        toNet(){
            this.$router.push('/net')
        },
        search(){
            this.findStr = this.searchName

            if (!this.searchName){
                this.title = '全部小说'
            } else {
                this.title = '关键字：' + this.searchName
            }
            this.getData(1)

        },
        list(row){
            this.$router.push(`list/${row.id}`)
        }
    },
    created(){
        this.getData(1)
    },
    computed:{
        isPC() {
            let sUserAgent = navigator.userAgent.toLowerCase();
            let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            let bIsMidp = sUserAgent.match(/midp/i) == "midp";
            let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            let bIsAndroid = sUserAgent.match(/android/i) == "android";
            let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                return false;
            } else {
                return true;
            }
        }
    }
}
</script>

<style scoped lang='scss'>
.back{
    font-size: 20px;
    margin-bottom: 10px;
}
#license{
    position: absolute;
    bottom: 5px;
    left: 45%;

    a{
        color: black;
        text-decoration: none;
    }
}
</style>
