import ServiceHelpRequest from '../models/ServiceHelpRequest.js';

export const createRequest = async (req, res) => {
  try {
    const newRequest = new ServiceHelpRequest({
      userName: req.body.userName,
      email: req.body.email,
      ...req.body
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await ServiceHelpRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateRequest = async (req, res) => {
  try {
    const request = await ServiceHelpRequest.findOne({ _id: req.params.id, userName: req.body.userName });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (Date.now() - request.createdAt > 30 * 60 * 1000) {
      return res.status(403).json({ message: 'Cannot edit request after 30 minutes' });
    }
    Object.assign(request, req.body);
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await ServiceHelpRequest.findOne({ _id: req.params.id, userName: req.body.userName });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (Date.now() - request.createdAt > 30 * 60 * 1000) {
      return res.status(403).json({ message: 'Cannot delete request after 30 minutes' });
    }
    await request.remove();
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
