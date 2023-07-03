import { EuiHeader, EuiHeaderLinks, EuiHeaderLink, EuiHeaderSectionItem } from '@elastic/eui';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';

import { icon as EuiHeaderLogo } from '@elastic/eui/es/components/icon/assets/logo_elastic';

appendIconComponentCache({
  elasticLogo: EuiHeaderLogo,
});

const Header = () => {
  return (
    <EuiHeader>
      <EuiHeaderSectionItem borders="right">
        <EuiHeaderLogo>Elastic</EuiHeaderLogo>
        <EuiHeaderLinks key="basicHeaderLinks" aria-label="App-Nav">
          <EuiHeaderLink isActive>Ingest Pipeline Builder</EuiHeaderLink>
          <EuiHeaderLink> About</EuiHeaderLink>
        </EuiHeaderLinks>
      </EuiHeaderSectionItem>
    </EuiHeader>
  );
};

export default Header;
