import { EuiFlexGroup, EuiFlexItem, EuiFieldText, EuiFormRow } from '@elastic/eui';
import { useEffect } from 'react';
import { useGlobalState } from '../hooks/GlobalState';
import { runPipeline } from '../helpers/Helpers';

const Samples = () => {
  const logSamples = useGlobalState((state) => state.samples);
  const setSample = useGlobalState((state) => state.setSample);

  useEffect(() => {
    const ingestPipeline = useGlobalState.getState().ingestPipeline;
    if (logSamples.length === 0) {
      return;
    }
    try {
      JSON.parse(JSON.stringify(ingestPipeline));
    } catch (error) {
      console.log(error);
      return;
    }
    const getData = setTimeout(() => {
      runPipeline(ingestPipeline, logSamples);
    }, 500);
    return () => clearTimeout(getData);
  }, [logSamples]);

  const handleLogSampleChange = (index, value) => {
    setSample(index, value);
  };

  return (
    <EuiFlexGroup direction="column">
      {logSamples?.map((sample, index) => (
        <EuiFlexItem key={index}>
          <EuiFormRow fullWidth label={`Log Sample ${index + 1} - JSON Only when using ChatGPT for now`}>
            <EuiFieldText
              fullWidth
              placeholder='{"actor":{"alternateId":"someusername@elastic.co","detailEntry":null,"displayName":"xxxxxx","id":"00u1abvz4pYqdM8ms4x6","type":"User"},"authenticationContext":{"authenticationProvider":null,"authenticationStep":0,"credentialProvider":null,"credentialType":null,"externalSessionId":"102nZHzd6OHSfGG51vsoc22gw","interface":null,"issuer":null},"client":{"device":"Computer","geographicalContext":{"city":"Dublin","country":"United States","geolocation":{"lat":37.7201,"lon":-121.919},"postalCode":"94568","state":"California"},"id":null,"ipAddress":"175.16.199.1","userAgent":{"browser":"FIREFOX","os":"Mac OS X","rawUserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0"},"zone":"null"},"debugContext":{"debugData":{"authnRequestId":"XkcAsWb8WjwDP76xh@1v8wAABp0","requestId":"XkccyyMli2Uay2I93ZgRzQAAB0c","requestUri":"/login/signout","threatSuspected":"false","url":"/login/signout?message=login_page_messages.session_has_expired"}},"displayMessage":"User logout from Okta","eventType":"user.session.end","legacyEventType":"core.user_auth.logout_success","outcome":{"reason":null,"result":"SUCCESS"},"published":"2020-02-14T22:18:51.843Z","request":{"ipChain":[{"geographicalContext":{"city":"Dublin","country":"United States","geolocation":{"lat":37.7201,"lon":-121.919},"postalCode":"94568","state":"California"},"ip":"175.16.199.1","source":null,"version":"V4"}]},"securityContext":{"asNumber":null,"asOrg":null,"domain":null,"isProxy":null,"isp":null},"severity":"INFO","target":null,"transaction":{"detail":{},"id":"XkccyyMli2Uay2I93ZgRzQAAB0c","type":"WEB"},"uuid":"faf7398a-4f77-11ea-97fb-5925e98228bd","version":"0"}'
              value={sample}
              onChange={(e) => handleLogSampleChange(index, e.target.value)}
            />
          </EuiFormRow>
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
};

export default Samples;
