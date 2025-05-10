import { MASTERS, MASTERS_API } from "../config/constants";
import { toast } from "../hooks/use-toast";
import { useMutation} from "@tanstack/react-query"
import axios from "axios";

export const fetchData = async (type, apiRoute, signal) => {
  const config = { signal };
  if (type) {
    config.params = { type };
  }

  const response = await axios.get(apiRoute, config);

  if (response.status !== 200) {
    throw new Error("Error fetching records");
  }
  return response.data;
};

export const useCustomerMutation = () => {
  return useMutation({
    mutationFn: async (newRecord) => {
      const response = await axios.post(MASTERS_API, {
        type: MASTERS[5],
        record: newRecord,
        id: newRecord.code,
      });
      if (response.status !== 200) {
        throw new Error(response.data.message || "Error adding record");
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
};

export const useVendorMutation = () => {
  return useMutation({
    mutationFn: async (newRecord) => {
      const response = await axios.post(MASTERS_API, {
        type: MASTERS[6],
        record: newRecord,
        id: newRecord.code,
      });
      if (response.status !== 200) {
        throw new Error(response.data.message || "Error adding record");
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
};

export const useStockMutation = () => {
  return useMutation({
    mutationFn: async (newRecord) => {
      const response = await axios.post(MASTERS_API, {
        type: MASTERS[7],
        record: newRecord,
        id: newRecord.code,
      });
      if (response.status !== 200) {
        throw new Error(response.data.message || "Error adding record");
      }
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Record added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
};
