import { gql } from '@apollo/client';

export const GET_CONGRATULATIONS = gql`
  query {
    readCongratulations {
      groupedCongratulations {
        congratulations {
          id
          icon
          congratulationText
        }
        icon
        count
      }
    }
  }
`;