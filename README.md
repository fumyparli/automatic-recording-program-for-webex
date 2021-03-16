# automatic-recording-program-for-webex

이 데스크탑 앱은 웹엑스를 위한 자동 녹화 프로그램입니다.

node.js기반으로 electron, desktopCapturer, puppeteer등을 사용해 개발했습니다.
<br></br>

```
npm start
```
위와 같이 실행하여 사용 할 수 있습니다.
<br></br>

```
npm run make
```
위와 같이 빌드하여 사용 할 수 있습니다.
<br></br>

이름, 이메일, Webex주소, 시간을 입력 후 실행하면 지정한 시간에 자동으로 크로미움을 실행, 녹화를 하고 자동으로 녹화를 종료하고 브라우저를 닫습니다.

자동으로 username/recordedFile 폴더에 "fumy-[현재시간:년,월,일,시,분].webm" 으로 저장됩니다.

스케줄이 여러개라도 좋습니다!
<br></br>

1. 실행 시 처음화면
<img width="696" alt="스크린샷 2021-03-16 오후 11 44 37" src="https://user-images.githubusercontent.com/60137834/111332451-26050d80-86b5-11eb-9bf3-6c643725b14e.png">
<br></br>
2. 실행 후 녹화중 🔥
<br></br>
<img width="666" alt="스크린샷 2021-03-17 오전 12 03 39" src="https://user-images.githubusercontent.com/60137834/111334492-f48d4180-86b6-11eb-994e-a1cdc87cdc21.png">
<br></br>
3. 녹화 종료 후 저장된 파일 재생
<br></br>
<img width="622" alt="스크린샷 2021-03-17 오전 12 05 05" src="https://user-images.githubusercontent.com/60137834/111334513-f7883200-86b6-11eb-9636-7edb65b4955e.png">
<br></br>
😢 아직 오디오는 녹음 되지 않습니다. 코덱 문제로 수정중입니다.
