import { EuiSpacer, EuiPage, EuiPageBody } from "@elastic/eui";
import Header from "./components/header/Header";
import MainPage from "./components/main/MainPage.jsx";

function App() {
  return (
    <div>
      <Header />
      <EuiSpacer />
      <EuiPage grow={false}>
        <EuiPageBody>
          <MainPage />;
        </EuiPageBody>
      </EuiPage>
    </div>
  );
}

export default App;
