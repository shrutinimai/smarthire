import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://smarthire-backend-chzw.onrender.com/api/jobs";
const getToken = () => localStorage.getItem("token");

export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API, { params: filters });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/create",
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API, jobData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  "jobs/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/company/myjobs`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (jobId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/${jobId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    myJobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.myJobs.unshift(action.payload.job);
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.myJobs = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.filter((job) => job.id !== action.payload);
      });
  },
});

export default jobSlice.reducer;
