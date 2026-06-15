export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-sky-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-sky-800 mb-6">プライバシーポリシー</h1>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-sky-700 mb-2">はじめに</h2>
            <p>
              CHUNI OP Calculator（以下「本サービス」）は、CHUNITHMのOver Power計算を補助する非公式ツールです。
              本ページでは、本サービスにおける個人情報・データの取り扱いについて説明します。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sky-700 mb-2">収集する情報</h2>
            <p>
              本サービスは、ユーザーが入力したchunirecユーザー名をもとにchunirec APIへリクエストを送信します。
              入力されたユーザー名およびスコアデータはサーバーに保存されません。
              OP履歴・ToDoデータはお使いのブラウザのlocalStorageにのみ保存されます。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sky-700 mb-2">広告について（Google AdSense）</h2>
            <p>
              本サービスでは、Google LLCが提供する広告配信サービス「Google AdSense」を利用しています。
              Google AdSenseはCookieを使用して、ユーザーの興味に応じた広告を表示します。
              Cookieの利用を無効にする場合は、<a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline"
              >Google広告設定ページ</a>からオプトアウトできます。
            </p>
            <p className="mt-2">
              Googleによる広告Cookieの利用については、
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline"
              >Googleの広告に関するポリシー</a>をご参照ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sky-700 mb-2">外部サービスの利用</h2>
            <p>
              本サービスはスコアデータの取得に<a
                href="https://chunirec.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline"
              >chunirec</a>のAPIを利用しています。
              chunirecにおける個人情報の取り扱いについては、chunirecのプライバシーポリシーをご確認ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sky-700 mb-2">免責事項</h2>
            <p>
              本サービスはCHUNITHMの非公式ツールであり、株式会社セガとは一切関係ありません。
              本サービスの利用によって生じたいかなる損害についても、運営者は責任を負いかねます。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sky-700 mb-2">プライバシーポリシーの変更</h2>
            <p>
              本ポリシーは必要に応じて予告なく変更する場合があります。
              変更後は本ページにて最新の内容をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sky-700 mb-2">お問い合わせ</h2>
            <p>
              本サービスに関するお問い合わせは、
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline"
              >X（旧Twitter）</a>のDMにてご連絡ください。
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-200">
            制定日：2025年6月
          </p>
        </div>

        <div className="mt-8">
          <a href="/" className="text-sky-500 text-sm hover:underline">← トップに戻る</a>
        </div>
      </div>
    </div>
  );
}
