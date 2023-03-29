<!--нет прелоадера в моменте пустой экран-->
<!--нет статуса ошибки если упадет то пустой экран-->
<!--нет случая когда данные пустые либо нет совпадений тогда опять же пусто экран-->

<template>
  <!-- тут получается "дивная верстка" я бы добавил хотя бы section-->
  <div>
    <div v-if="chain">
      <pre><b>Chain:</b></pre>
      <pre>{{ chain }}</pre>
    </div>
    <!--  вместо br лучше через стили оформить  -->
    <br>
    <div v-if="tokenInfo">
      <!--   тут лучше strong использовать   -->
      <pre><b>Token id:</b></pre>
      <pre>{{ tokenInfo.id }}</pre>
    </div>
    <!--  вместо br лучше через стили оформить  -->
    <br>
    <div v-if="tokenInfo">
    <!--   тут лучше strong использовать   -->
      <pre><b>Token contract:</b></pre>
      <pre>{{ tokenInfo.contract }}</pre>
    </div>
    <!--  вместо br лучше через стили оформить  -->
    <br>
    <div v-if="tokenMetadata">
      <pre><b>Token metadata:</b></pre>
      <!--  вот тут возможно не стоит использовать сокращенный тег а лучге  <pre v-html="tokenMetadata" ></pre> для seo оптимизации  -->
      <!--  не стоит использовать опасную вставку html так как могуть быть xss атаки  вместо v-html я бы использовал v-text-->
      <!--  если уж нужна такая вставка то для json я бы использовать тег code    -->
      <pre v-html="tokenMetadata" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { getChain, getTokenInfo, getTokenMetadata } from './api';

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: 1234, // вот такой дефолт мне кажется не очень решением так как мы не можем точно знать что на бэке есть такой элемент с таким id
    },
  },
  setup(props) {
    // я бы вынесл в константу а может даже в .env файл
    const chain = ref('Mainnet');
    const tokenInfo = ref(null);
    const tokenMetadata = ref(null);
    // вынес бы в константу глобальную
    const whitelisted = ['XTZ', 'TZBTC', 'USDT', 'USDC', 'USDS', 'KUSD', 'WBTC', 'WETH'];

    const processMetadata = (metadata) => {
      let json = JSON.stringify(metadata, null, '\t');
      for (const name of whitelisted) {
        // вот в идеале я бы проверял по ID  а не по name
        // использовал бы строгое сравнение ===
        if (name == metadata.name) {
          // не уверен в том что тут безопасно использовать replace так как может подменить еще в дургих местах
          // если уж надо выделять какие именно то шаблонизатор в помощь
          // не уверен в инлайн стили лучше использовать css класс
          json = json.replace(`"${name}"`, `<span style="color:limegreen">${name}</span>`);
        }
      }
      // возможно тут будет протокол http и тогда ссылка будет корявой
      for (const match of json.matchAll(/"https?:\/\/[^"]+"/g)) {
        // вот этот код ниже лучше описать и вынести в отдельную функцию а еще лучше использовать готовую либу что бы быть уверенным в работе
        const link = match[0].substring(1, match[0].length - 1);
        //  не уверен но возможно тут могут быть ошибки с ссылками а в частности ссылки могут отображаться с другими данными
        // думаю лучше добавить target="_blank" что бы пользователь не уходил с сайта и не грузил все заново
        json = json.replace(link, `<a href="${link}">${link}</a>`);
      }
      return json;
    };

    onMounted(async () => {
      // нет никаких обработчиков ошибок я бы добавил try catch
      tokenMetadata.value = processMetadata(await getTokenMetadata());
      tokenInfo.value = await getTokenInfo(props.id);
      chain.value = await getChain();
    });

    return {
      chain,
      // на сколько я понял в описании к задаче там рандомный json и я бы сделал проверку на наличие id contact
      tokenInfo,
      tokenMetadata,
    };
  },
})
</script>

<!-- вот тут добавил бы параметр scoped потом что мы можем влиять на дивы во всей приле 0_о-->
<!--плюс добавил бы препроцессор scss например-->
<style>
div {
  /*вот мне кажется можно обойтись без important*/
  padding: 1rem !important;
}

/*вот такое каскадное обращение не совсем явное и моэет вызвать сложности при рефакторинге*/
/*мы тут еще перезаписываем padding который указан на строке 82 и честно это добавляет головной боли :)*/
div > div {
  /*вот мне кажется можно обойтись без important*/
  padding: 0 !important;
}
</style>