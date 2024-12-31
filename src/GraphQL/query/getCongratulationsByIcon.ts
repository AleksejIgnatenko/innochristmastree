import { gql } from '@apollo/client';

export const GET_CONGRATULATIONS_BY_ICON = gql`
query GetCongratulationsByIcon($icon: String!) {
  congratulationsByIcon(icon: $icon) {
    groupedCongratulations {
      icon
      count
      congratulations {
        icon
        congratulationText
      }
    }
  }
}
`;