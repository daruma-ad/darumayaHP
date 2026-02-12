# FTPアップロード手順

## アップロードするファイル一覧

```
ftp_upload/
├── index.html          (トップページ)
├── styles.css          (スタイルシート)
└── images/
    ├── hero.png             (ヒーロー画像)
    ├── service-furisode.png (振袖サービス画像)
    └── service-maintenance.png (メンテナンスサービス画像)
```

## アップロード手順

### 1. FTPクライアントの準備
- FileZilla、Cyberduck、FFFTPなどのFTPクライアントをご用意ください
- サーバーから提供されたFTP接続情報（ホスト名、ユーザー名、パスワード）を用意

### 2. サーバーに接続
- FTPクライアントで接続情報を入力して接続

### 3. ファイルをアップロード
- `ftp_upload` フォルダ内の全ファイルを、サーバーの公開ディレクトリ（通常は `public_html` や `www`）にアップロード
- **フォルダ構造を維持したままアップロードしてください**

### 4. 確認
- ブラウザでサイトのURLにアクセスして表示を確認

## 公開後の設定（推奨）

### 1. Google Maps の埋め込みコード更新
`index.html` 内の Google Maps iframe を、実際の店舗位置の埋め込みコードに差し替えてください：
1. [Google Maps](https://www.google.com/maps) で店舗住所を検索
2. 「共有」→「地図を埋め込む」を選択
3. 生成されたコードをコピーして差し替え

### 2. お問い合わせフォームの設定
現在のフォームはデモ用です。実際に機能させるには：
- フォーム送信サービス（Formspree、Google Formsなど）と連携
- または、サーバー側でPHPなどのスクリプトを設置

### 3. canonical URL の設定
`index.html` 内のコメントアウトされた canonical タグを有効化し、実際のURLを設定：
```html
<link rel="canonical" href="https://www.あなたのドメイン.com/">
```

## 画像の最適化（任意）

現在の画像はPNG形式です。ページ読み込み速度を向上させたい場合は、WebPやJPEG形式への変換をご検討ください。
