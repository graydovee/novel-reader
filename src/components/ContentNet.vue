<template>
    <div class="chapter" id="chapter">
        <h1 class="title">{{title}}</h1>
        <div class="content" style="white-space: pre-wrap;">{{content}}</div>
    </div>
</template>

<script>
    export default {
        name: 'Content',
        props: {
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String,
                default: ''
            }
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
