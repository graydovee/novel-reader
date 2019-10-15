<template>
    <div>
        <div style="overflow:auto">
            <content-net v-for="chapter in chapters" :key="chapter.id" :title="chapter.title" :content="chapter.content"></content-net>
        </div>
        <p v-if="loading" style="height: 100px" v-loading="loading" element-loading-background="antiquewhite" element-loading-text="加载中..."></p>
        <p v-if="noMore" class="inf">没有更多了</p>
        <div class="draw" @click="drawer = true">
            <span class="el-icon-arrow-down"></span>
        </div>
        <el-drawer
                title="操作"
                :visible.sync="drawer"
                direction="ttb">
            <el-row style="text-align: center">
                <el-col :span="8" :offset="4">
                    <el-button @click="$router.push(`/`)">返回主页</el-button>
                </el-col>
                <el-col :span="8">
                    <el-button @click="goList">返回章节目录</el-button>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
import ContentNet from '@/components/ContentNet'
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

p{
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
