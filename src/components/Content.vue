<template>
    <div class="chapter" id="chapter">
        <h1 class="title">{{chapter.title}}</h1>
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
            }
        },
        created(){
            this.$axios.get('content?id='+this.chapter.contentId).then(res=>{
                this.content = res.data;
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
