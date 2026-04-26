// src/__tests__/ButtonAPICall.test.js
// src/__tests__/ButtonAPICall.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonAPICall from '../ButtonAPICall';
import axios from 'axios';

// Mock axios to prevent actual API calls during testing
jest.mock('axios');

describe('ButtonAPICall Component', () => {
  test('fetches data from API on button click', async () => {
    const mockResponse = { data: [{ id: 1, title: 'Test Todo' }] };
    axios.get.mockResolvedValue(mockResponse);

    const { getByText } = render(<ButtonAPICall />);
    fireEvent.click(getByText(/fetch todos/i));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
    });
  });

  /* added code starts */
  test('matches the snapshot', () => {
    const { asFragment } = render(<ButtonAPICall />);
    expect(asFragment()).toMatchSnapshot();
  });
  /* added code stops */

});
