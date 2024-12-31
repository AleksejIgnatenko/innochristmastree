import { gql } from '@apollo/client';

export const SUBSCRIBE_TO_ADD_CONGRATULATION = gql`
  subscription {
    subscribeToAddCongratulation {
      id
      icon
      congratulationText
      count
    }
  }
`;