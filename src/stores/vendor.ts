import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';
import type { Vendor } from '@/lib/database.types';

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendor: null as Vendor | null,
    vendors: [] as Vendor[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchVendor(profileId: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('profile_id', profileId)
          .single();

        if (error) throw error;
        this.vendor = data as Vendor;
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },

    async createVendor(vendorData: Omit<Vendor, 'id' | 'created_at'>) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase.from('vendors').insert(vendorData);
        if (error) throw error;

        // Optionally, fetch the vendor again to update the state
        await this.fetchVendor(vendorData.profile_id);
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },

    async updateVendor(vendorId: string, updates: Partial<Vendor>) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase
          .from('vendors')
          .update(updates)
          .eq('id', vendorId);
        if (error) throw error;

        // Optionally, fetch the updated vendor
        if (this.vendor) await this.fetchVendor(this.vendor.profile_id);
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },
  },
});
