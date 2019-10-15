<template>
    <div>
        <div style="overflow:auto">
            <bookContent v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"></bookContent>
        </div>
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
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
import bookContent from '@/components/Content'
import lodash from 'lodash'

export default {
    name: 'Read',
    data () {
        return {
            bookId: 0,
            chapters:[],
            loading: true,
            noMore: false,
            finalChapter:{},
            drawer: false
        }
    },
    components: {
        bookContent,
    },
    methods:{
        getPage(id){
            if(!id) {
                this.noMore = true;
                return;
            }
            let data = {
                chapterId: id
            }
            this.$axios.post("chapter",data).then(res => {
                let data = res.data
                this.chapters.push(data);

                this.store(this.finalChapter.id)
                this.finalChapter = data;
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
        },
        getNextPage(){
            if(this.loading && !this.noMore)
                return;
            this.loading = true;


            let next = this.finalChapter.nextChapterId
            if(next){
                this.getPage(next);
            } else {
                this.loading = false;
                this.noMore = true;
            }
        },
        handleScroll() {
            let scrollY = window.scrollY
            let height = document.body.scrollHeight
            let screen = window.screen.height;
            if(height - scrollY - screen < 50){
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
        },500)
    },
    created(){
        this.bookId = this.$route.params.bookId;
        if (this.bookId) {
            let str = localStorage.getItem('store')
            if (str) {
                let data = JSON.parse(str)

                this.getPage(data[this.bookId])
            } else {
                this.$message.error("非法跳转")
            }
        } else {
            this.$message.error("路径错误")
        }

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
</style>
