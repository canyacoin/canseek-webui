# CanSeek
CanSeek - Refer High Quality Talent Earn Rewards

### Install

Get encrypt zip file from [google docs](https://drive.google.com/drive/u/1/folders/1R7OQgJAFLdu5AlAAvFPtayLVa7kwiLW4), then move them to right places according to `.travis.yml`.

```
npm install -g @angular/cli yarn
yarn
```

### Frame

https://ng.ant.design/docs/introduce/en

### Run locally
```
npm start
```

### Build
```
ENV=dev npm run build # for staging
ENV=prod npm run build # for production
```

### Deploy
```
git push origin develop # for https://staging.canseek.io/
git push origin master # for https://canseek.io/
```

### Directory

```
├── src
│   ├── app
│   │   ├── ...
│   │   ├── components # common components
│   │   │   ├── ...
│   │   │   └── cmp-upload
│   │   ├── layout
│   │   │   ├── footer
│   │   │   └── header
│   │   ├── models
│   │   │   ├── authstate.ts
│   │   │   ├── notify.ts
│   │   │   └── profile.ts
│   │   ├── pages # map router
│   │   │   ├── home
|   │   │   │   └── components
|   │   │   │       ├── cmp-header
|   │   │   │       └── cmp-post
│   │   │   ├── pagenotfound
│   │   │   ├── ...
│   │   ├── services
│   │   │   ├── ...
│   │   │   └── profile.service.ts
│   │   ├── store.ts
│   │   └── util.ts
│   ├── assets
│   │   ├── ...
│   │   ├── fonts # from http://www.iconfont.cn/
│   │   │   ├── ...
│   │   │   ├── iconfont
│   │   │   └── ...
│   │   └── ...
│   ├── environments
│   │   ├── environment.dev.ts # ENV=dev
│   │   ├── environment.prod.ts # ENV=prod
│   │   └── environment.ts
│   ├── styles.less # overwrite antd's style
│   ├── theme.less # antd theme variables
│   └── ...
└── ...

```

### Product Flow

View on [google docs](https://drive.google.com/drive/u/1/folders/1R7OQgJAFLdu5AlAAvFPtayLVa7kwiLW4)