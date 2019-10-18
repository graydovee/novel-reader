<template>
    <div>
        <div style="overflow:auto">
            <content-net v-for="chapter in chapters" :key="chapter.id" :title="chapter.title" :content="chapter.content"></content-net>
        </div>
        <p class="bg" v-if="loading" style="height: 100px" v-loading="loading" element-loading-background="antiquewhite" element-loading-text="加载中..."></p>
        <p v-if="noMore" class="inf bg">没有更多了</p>
        <div class="draw" @click="drawer = true">
            <span class="el-icon-arrow-down"></span>
        </div>
        <el-drawer
                title="操作"
                :visible.sync="drawer"
                direction="ttb">
            <el-row style="text-align: center">
                <el-col :span="8" :offset="4">
                    <el-button @click="$router.push('/net')">返回主页</el-button>
                </el-col>
                <el-col :span="8">
                    <el-button @click="$router.push('/net/list')">返回章节目录</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="8">
                    <el-button type="primary" @click="spider_down" style="margin-top: 10px">从此章开始爬取</el-button>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
import ContentNet from '@/components/ContentNet'
import bus from '@/utils/bus'
import lodash from 'lodash'

export default {
    name: 'Read',
    data () {
        return {
            url: '',
            chapters:[],
            loading: false,
            noMore: false,
            drawer: false
        }
    },
    components: {
        ContentNet,
    },
    methods:{
        getPage(url){
            let data = {
                url: url
            }
            this.$axios.post("/spider/content", data).then(res => {
                if(res.code === 200){
                    let data = res.data
                    this.chapters.push(data);
                    this.url = data.url
                } else {
                    this.$message.error("获取失败")
                }
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
        },
        getNextPage(){
            if(this.loading && !this.noMore)
                return;
            this.loading = true;

            if(this.url && this.url.length>0){
                this.getPage(this.url);
            } else {
                this.loading = false;
                this.noMore = true;
            }
        },
        handleScroll() {
            let scrollY = window.scrollY
            let height = document.body.scrollHeight
            let screen = window.screen.height;
            if(height - scrollY - screen < 5){
                this.getNextPage();
            }
        },
        store(id){
            if(id){
                let str = localStorage.getItem('store')
                let data
                if (str) {
                    data = JSON.parse(str)
                } else {
                    data = {}
                }
                data[this.bookId] = id
                localStorage.setItem("store", JSON.stringify(data));
            }
        },
        spider_down(){
            this.$prompt('请输入管理员口令', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let data = {
                    bookName: bus.$data.book_s.name,
                    authorName: bus.$data.book_s.author,
                    url: bus.$data.chapter_s.url,
                    token: value
                }
                if (bus.$data.book_s.name && bus.$data.book_s.author && bus.$data.chapter_s.url) {
                    this.$msgbox({
                        title: '提示',
                        message: this.$createElement('p', {style: 'background-color:white;padding: 0 10%'} , [
                            this.$createElement('p', null ,`书名：${data.bookName}`),
                            this.$createElement('p', null ,`作者：${data.authorName}`),
                            this.$createElement('p', null ,`首章地址：${data.url}`)
                        ]),
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        confirmButtonText: '开始爬取'
                    }).then(() => {
                        this.$axios.post('/book', data).then(res=>{
                            if (res.code === 200) {
                                this.$message.success("正在爬取")
                            } else {
                                this.$message.error(res.data)
                            }
                        }).catch(()=>{
                            this.$message.error("爬取失败")
                        })
                    })

                } else {
                    this.$message.error("信息不完整")
                }
            })

        },
        goList(){
            this.$router.push(`/list/${this.bookId}`)
        },
        loadMore: lodash.throttle(function(){
            this.handleScroll()
        },1000)
    },
    created(){
        this.url = this.$route.params.url
        if (this.url)
            this.getNextPage()
        else
            this.$message.error("无效跳转")
    },
    mounted() {
        window.addEventListener('scroll', this.loadMore, true)
    }
}
</script>

<style scoped lang="scss">

.bg{
    background-color: antiquewhite;
    text-align: center;
    padding: 0;
    margin: 0;
}
.list{
    list-style: none;
    margin: 0;
    padding: 0;

    ul{
        margin: 0;
        padding: 0;
    }
}
.draw{
    position: fixed;
    top: 1vh;
    right: 1vh;
    font-size: 30px;
}
.inf{
    padding: 5% 0;
}
</style>
