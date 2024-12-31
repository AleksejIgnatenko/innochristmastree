import { gql } from '@apollo/client';

export const CREATE_CONGRATULATION = gql`
  mutation CreateCongratulation($icon: String!, $congratulationText: String!) {
    createCongratulation(icon: $icon, congratulationText: $congratulationText) {
      id
      icon
      congratulationText
      count
    }
  }
`;