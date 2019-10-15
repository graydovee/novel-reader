<template>
    <div class="chapter" id="chapter">
        <h1 class="title">{{chapter.title}}</h1>
        <div style="height: 500px"  v-if="loading" v-loading="loading" element-loading-background="antiquewhite"></div>
        <div class="content" style="white-space: pre-wrap;">{{content.info}}</div>
    </div>
</template>

<script>
    export default {
        name: 'Content',
        props: ['chapter'],
        data(){
            return {
                content:{},
                loading: true
            }
        },
        created(){
            this.$axios.get('content?id='+this.chapter.contentId).then(res=>{
                this.content = res.data;
                this.loading = false
            })
        }
    }
</script>

<style scoped>
    #chapter{
        background-color: antiquewhite;
    }
    .title{
        text-align: center;
        padding: 30px 10% 0 10%;
    }
    .chapter{
        overflow: auto;
    }
    .content{
        white-space: pre-wrap;
        word-break: break-all;
        word-wrap:break-word;
        overflow: auto;
        padding: 0 10%;
        font-size: 20px;
        line-height: 30px;
    }

</style>
