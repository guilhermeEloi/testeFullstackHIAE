import React from 'react';

import {
  ContainerHeader,
  ContainerHeaderContent,
  TitleHeader,
} from './styles';

const Header: React.FC = () => {
  return (
    <ContainerHeader>
      <ContainerHeaderContent>
        <TitleHeader>
          LavaCar
        </TitleHeader>
      </ContainerHeaderContent>
    </ContainerHeader>
  );
}

export default Header;
