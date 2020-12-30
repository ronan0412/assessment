'use strict';//厳格モード

//html側のidを指定して要素を取得する
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');
    
/**
 * 指定した要素の子を全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
    while (element.firstChild) {
        //子供の要素がある限り削除
        element.removeChild(element.firstChild);
    }
}



//診断ボタンを押した時の処理（+EC6での無名関数の書き方）
//++functionではなく=>で表すことをアロー関数という
assessmentButton.onclick = () => {
    //++userNameInputオブジェクトのnodeValueプロパティから、入力された値を引き出せる
    const userName = userNameInput.value;
    //名前が空のとき(入力された文字の長さが0の場合)は処理を終了する
    if (userName.length === 0) {
        console.log(assessmentButton.onclick);
        //関数内でのreturn;は、戻り値なしにそこで処理を終了するという意味。このように特定の処理の際に処理を終了させることをガード句という
        return;
    }
    
    //TODO 診断結果表示エリアの作成
    removeAllChildren(resultDivided);
    
    const header = document.createElement('h3');//要素を作成し、
    header.innerText = '診断結果';//その中に文字を設定することができる。
    resultDivided.appendChild(header);//divタグを親として、<h3>タグの子を追加する

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivided.appendChild(paragraph);

    //TODO ツイートエリアの作成
    removeAllChildren(tweetDivided);
    const anchor = document.createElement('a');
    //未エンコードの全角文字列を削り、エンコードした文字列で結合する
    const hrefValue = 
        'https://twitter.com/intent/tweet?button_hashtag=' +
        encodeURIComponent('あなたのいいところ') + //?から先のURIクエリで日本語を表示するために、エンコードしておく
        '&ref_src=twsrc%5Etfw';
    

    anchor.setAttribute('href', hrefValue);//setAttribute-->from第一引数（元の要素）to第二引数（追加する属性）
    anchor.className = 'twitter-hashtag-button';//aタグにいろいろ設定してる
    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #あなたのいいところ';
    //元のHTMLコード
    //<a href="https://twitter.com/intent/tweet?button_hashtag=あなたのいいところ&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-text="診断結果" data-show-count="false">Tweet #あなたのいいところ</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    tweetDivided.appendChild(anchor);
    //スクリプトのタグを作ってソースを設定
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);
};

//Enterキーを押した際にも、クリック時と同じ処理を実行
userNameInput.onkeydown = event => {
    if (event.key === 'Enter') {
        //onclick()処理を呼び出す
        assessmentButton.onclick();
    }
};


const answers = [
    '{userName}のいいところはa',
    '{userName}のいいところはb',
    '{userName}のいいところはc',
    '{userName}のいいところはd',
    '{userName}のいいところはe',
    '{userName}のいいところはf',
    '{userName}のいいところはg',
    '{userName}のいいところはh',
    '{userName}のいいところはi',
    '{userName}のいいところはj',
    '{userName}のいいところはk',
    '{userName}のいいところはl',
    '{userName}のいいところはm',
    '{userName}のいいところはn',
    '{userName}のいいところはo',
    '{userName}のいいところはp',
];

/** ↓JSDocと呼ばれる形式のコメントで、直下のassessment()の内容を説明している
 * -->JSDocはソースコードからドキュメントを自動生成してくれたり、カーソルを合わせたらインターフェース（関数内部の処理と、外部からの入力や外部への出力の境界）表示してくれたりして便利。
 * 
 * 処理内容: 名前の文字列を渡すと診断結果を返す関数
 * 引数: @param {string} userName ユーザーの名前
 * 戻り値: @return {string} 診断結果 {データの型}
 * 
 * -->引数が文字列で、返り値も文字列であることを説明している
 * -->JSはソースコードに変数の型を書かないので、コメントで記す必要がある
 */
function assessment(userName) {
    //全文字のコード番号を取得してそれを足し合わせる
    let sumOfCharCode = 0;//letで定義した変数はforやifなど{}内でしか使えない
    for (let i = 0; i < userName.length; i++) {
        sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);
    }
    //文字コード番号の合計を回答の数で割って添字の数値を求める(sumOfCharCode-->名前から計算した文字コードの合計値)
    let index = sumOfCharCode % answers.length;//診断結果のパターン数で割って余りを出し、その余りを添字とした数でパターンを出力
    let result = answers[index];//=割る数は一定にして、割られる数を入力した文字数次第にすることで、同じ名前が入ってきたら答えを同じにしてる
    //逆に言えば、同じ名前でも平仮名とかにして文字コードを変えれば結果が変わるのかな

    result = result.replace(/\{userName\}/g, userName);//replace(A, B)-->AをBに置き換える。/.../gが全部一致、\{ \}がエスケープsequence
    //正規表現-->さまざまな文字列のパターンを表現するための記述方法のこと
    return result;
}

//console.logはコンソールに結果を表示するための関数で、テスト用の関数はconsole.assert
console.log(assessment('はるか'));
console.log(assessment('はるか'));
console.log(assessment('はるか'));

console.assert(//第一引数に、正しいときtrueを出力させたい関数を入れる。第二引数に、falesの時に表示するテキストを入れる。
    //正しい出力結果
    assessment('はるか') === 'はるかのいいところはf',
    //正しい出力結果が出なかった時のメッセージ
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'

);

console.assert(
    assessment('はるか') === assessment('はるか'),
    //AがBの出力結果と同じであること
    '入力が同じ名前の時に同じ診断結果が出る処理がうまく行ってないよ'
);
