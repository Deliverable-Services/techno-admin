import { useState, useEffect } from "react";
import API from "../../utils/API";
import { Button } from "@radix-ui/themes";
import { Input } from "../ui/input";
import { showErrorToast } from "../../utils/showErrorToast";
import useUserProfileStore from "../../hooks/useUserProfileStore";

const DomainTab: React.FC = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);

  const [domain, setDomain] = useState<string>("");
  const [hostName, setHostName] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (loggedInUser?.primary_organisation?.domain) {
      setDomain(loggedInUser.primary_organisation.domain);
    }
  }, [loggedInUser]);

  const handleCheckDomain = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!domain) return;
    setLoading(true);
    try {
      const response = await API.post("/domain/check", { domain });
      setHostName(response?.data || "No host name found");

      if (response?.data?.data?.is_pointed) {
        setCanUpdate(true);
      } else {
        setCanUpdate(false);
      }

      setMessage({
        text: response?.data?.message || "Domain check complete",
        isError: !response?.data?.data?.is_pointed,
      });
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to check domain";
      showErrorToast(errorMsg);
      setMessage({ text: errorMsg, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const updateDomainName = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const res = await API.put(
        `/organisations/${loggedInUser?.primary_organisation?.id}`,
        { domain: hostName?.data?.domain }
      );

      setMessage({
        text: "Domain updated successfully",
        isError: false,
      });
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to update domain";
      showErrorToast(errorMsg);
      setMessage({ text: errorMsg, isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-5 space-y-4">
      <div className="tab-header">
        <h4 className="text-lg font-semibold">Domains</h4>
        <p className="text-gray-500">Manage your domains here</p>
      </div>

      <div className="flex items-center gap-2 w-1/2">
        <Input
          placeholder="Enter your domain"
          value={domain}
          disabled={!isEditing}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDomain(e.target.value)
          }
        />
        <Button onClick={handleCheckDomain} disabled={loading}>
          {loading ? "Checking..." : isEditing ? "Check" : "Update Domain"}
        </Button>
        <Button onClick={updateDomainName} disabled={!canUpdate || saving}>
          {saving ? "Saving..." : "Save Domain"}
        </Button>
      </div>

      {message && (
        <p
          className={`font-sans font-medium text-sm pt-1 mt-0 ${message.isError ? "text-red-400" : "text-green-400"
            }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default DomainTab;
