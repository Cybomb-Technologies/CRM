import React, { useState } from "react";

const CreateLead = () => {
  const [formData, setFormData] = useState({
    // Lead Information
    leadOwner: "Divya Baskaran",
    firstName: "",
    title: "",
    phone: "",
    mobile: "",
    leadSource: "",
    industry: "",
    annualRevenue: "",
    emailOptOut: false,
    company: "",
    lastName: "",
    email: "",
    fax: "",
    website: "",
    leadStatus: "",
    noOfEmployees: "",
    rating: "",
    skypeId: "",
    secondaryEmail: "",
    twitter: "",
    
    // Address Information
    country: "",
    flatNo: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    
    // Description
    description: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      country: "",
      flatNo: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: "",
      longitude: ""
    }));
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

  const inputClass = "w-full h-[38px] px-3 text-sm border border-[#d3d3d3] rounded-[6px] bg-white focus:outline-none focus:border-[#4675FF]";
  const requiredInputClass = `${inputClass} border-l-2 border-l-red-500`;
  const sectionTitleClass = "text-[17px] font-bold text-[#121212] mb-4";
  const sectionClass = "border-b border-gray-100 pb-6 mb-6";

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-gray-800">Create Lead</h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-sm text-white bg-[#4675FF] border border-[#3b63d5] rounded-md shadow-sm hover:bg-[#3b63f0]">
              Save and New
            </button>
            <button className="px-4 py-2 text-sm text-white bg-[#4675FF] border border-[#3b63d5] rounded-md shadow-sm hover:bg-[#3b63f0]">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Lead Image Section */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm text-gray-600">Lead Image</span>
        </div>

        {/* Lead Information Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Lead Information</h2>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Lead Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Owner</label>
                <div className="relative">
                  <input
                    type="text"
                    name="leadOwner"
                    value={formData.leadOwner}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <select name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass}>
                  <option value="">-None-</option>
                  <option value="John">John</option>
                  <option value="Jane">Jane</option>
                  <option value="Mike">Mike</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Lead Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                <select name="leadSource" value={formData.leadSource} onChange={handleChange} className={inputClass}>
                  <option value="">-None-</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Employee Referral">Employee Referral</option>
                  <option value="External Referral">External Referral</option>
                  <option value="Online Store">Online Store</option>
                  <option value="Partner">Partner</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Sales Email Alias">Sales Email Alias</option>
                  <option value="Seminar Partner">Seminar Partner</option>
                  <option value="Internal Seminar">Internal Seminar</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Web Download">Web Download</option>
                  <option value="Web Research">Web Research</option>
                  <option value="Chat">Chat</option>
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className={inputClass}>
                  <option value="">-None-</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Banking">Banking</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Communications">Communications</option>
                  <option value="Construction">Construction</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Education">Education</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Energy">Energy</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Finance">Finance</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Government">Government</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Media">Media</option>
                  <option value="Not For Profit">Not For Profit</option>
                  <option value="Recreation">Recreation</option>
                  <option value="Retail">Retail</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Technology">Technology</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Annual Revenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue (Rs.)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    Rs.
                  </div>
                  <input
                    type="text"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleChange}
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              {/* Email Opt Out */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailOptOut"
                  checked={formData.emailOptOut}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#4675FF] border-gray-300 rounded focus:ring-[#4675FF]"
                />
                <label className="ml-2 text-sm text-gray-700">Email Opt Out</label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={requiredInputClass}
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={requiredInputClass}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Fax */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Lead Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Status</label>
                <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} className={inputClass}>
                  <option value="">-None-</option>
                  <option value="Attempted to Contact">Attempted to Contact</option>
                  <option value="Contact in Future">Contact in Future</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Junk Lead">Junk Lead</option>
                  <option value="Lost Lead">Lost Lead</option>
                  <option value="Not Contacted">Not Contacted</option>
                  <option value="Pre Qualified">Pre Qualified</option>
                  <option value="Not Qualified">Not Qualified</option>
                </select>
              </div>

              {/* No. of Employees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Employees</label>
                <input
                  type="number"
                  name="noOfEmployees"
                  value={formData.noOfEmployees}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select name="rating" value={formData.rating} onChange={handleChange} className={inputClass}>
                  <option value="">-None-</option>
                  <option value="Acquired">Acquired</option>
                  <option value="Active">Active</option>
                  <option value="Market Failed">Market Failed</option>
                  <option value="Project Cancelled">Project Cancelled</option>
                  <option value="Shut Down">Shut Down</option>
                </select>
              </div>

              {/* Skype ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skype ID</label>
                <input
                  type="text"
                  name="skypeId"
                  value={formData.skypeId}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Secondary Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Email</label>
                <input
                  type="email"
                  name="secondaryEmail"
                  value={formData.secondaryEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="@"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Address Information</h2>
          
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Country / Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country / Region</label>
                  <select name="country" value={formData.country} onChange={handleChange} className={inputClass}>
                    <option value="">-None-</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Flat / House No. */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat / House No. / Building / Apartment Name
                  </label>
                  <input
                    type="text"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* State / Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                  <select name="state" value={formData.state} onChange={handleChange} className={inputClass}>
                    <option value="">-None-</option>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                    <option value="New York">New York</option>
                    <option value="Florida">Florida</option>
                    <option value="Illinois">Illinois</option>
                  </select>
                </div>

                {/* Zip / Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear All Link */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm text-[#4675FF] hover:text-[#3b63f0]"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Description Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 text-sm border border-[#d3d3d3] rounded-[6px] bg-white focus:outline-none focus:border-[#4675FF] resize-none"
              placeholder="Enter description..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              Create Form Views
            </button>
            <select className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md bg-white focus:outline-none">
              <option>Standard View</option>
              <option>Custom View 1</option>
              <option>Custom View 2</option>
            </select>
          </div>
          
          <button className="px-4 py-2 text-sm text-white bg-[#4675FF] border border-[#3b63d5] rounded-md shadow-sm hover:bg-[#3b63f0]">
            Create a custom form page
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLead;